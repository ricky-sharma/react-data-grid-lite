let idx = null;
let pages = [];

async function loadIndex() {
    const response = await fetch('search.json');
    pages = await response.json();
    lunr.tokenizer.separator = /[\s\-\._]+|(?=[A-Z])/;

    idx = lunr(function () {
        this.ref('url');
        this.field('title');
        this.field('content');

        pages.forEach(doc => this.add(doc));
    });
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function highlightQuery(text, query) {
    if (!text || !query) return text;

    // Highlight full query match first
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex
    const fullRegex = new RegExp(`\\b(${escapedQuery})\\b`, 'gi');
    text = text.replace(fullRegex, '<strong class="text-black-900 font-bold"><mark>$1</mark></strong>');

    // Highlight individual terms
    const terms = query.split(/\s+/).filter(Boolean);
    const allTerms = Array.from(terms);

    // Check if any "long" terms (4 or more chars) exist
    const hasLongTerm = allTerms.some(term => term.length >= 4);

    // Filter terms accordingly
    const filteredTerms = hasLongTerm
        ? allTerms.filter(term => term.length >= 4)
        : allTerms;
    for (const term of filteredTerms.sort((a, b) => b.length - a.length)) {
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedTerm})`, 'gi');
        text = text.replace(regex, '<strong class="text-black-900 font-bold"><mark>$1</mark></strong>');
    }

    return text;
}


async function search(query) {
    if (!idx) await loadIndex();

    if (typeof query === 'undefined') {
        query = document.getElementById('searchInput').value.trim();
    }
    if (!query) return;

    const originalQuery = query.trim();
    const lowerQuery = originalQuery.toLowerCase();

    // Set of unique search terms
    const terms = new Set();

    // Add raw and dot-replaced versions for Lunr tokenization
    terms.add(lowerQuery);
    terms.add(lowerQuery.replace(/[.]/g, ' '));

    // Split on common delimiters and add parts
    lowerQuery.split(/[.\s_]/).forEach(part => {
        if (part) terms.add(part);
    });

    // Convert to array for processing
    const allTerms = Array.from(terms);

    // Check if any "long" terms (4 or more chars) exist
    const hasLongTerm = allTerms.some(term => term.length >= 4);

    // Filter terms accordingly
    const filteredTerms = hasLongTerm
        ? allTerms.filter(term => term.length >= 4)
        : allTerms;

    const allResults = [];
    const seenRefs = new Set();

    // Run Lunr queries
    idx.query(q => {
        for (const term of filteredTerms.sort((a, b) => b.length - a.length)) {
            const termLength = term.length;

            // Boost proportionally to term length
            const baseBoost = termLength * 10;

            // Exact match
            q.term(term, { boost: baseBoost });

            // Wildcard match (trailing)
            q.term(term, {
                wildcard: lunr.Query.wildcard.TRAILING,
                boost: baseBoost / 5
            });

            // Fuzzy match (edit distance = 1)
            if (term.length > 3) {
                q.term(term, {
                    editDistance: 1,
                    boost: baseBoost / 10
                });
            }
        }
    }).forEach(result => {
        if (!seenRefs.has(result.ref)) {
            allResults.push(result);
            seenRefs.add(result.ref);
        }
    });

    // Show results
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';

    if (allResults.length === 0) {
        resultsList.innerHTML = '<li class="text-gray-500">No results found</li>';
        return;
    }

    allResults.forEach(result => {
        const page = pages.find(p => p.url === result.ref);
        let snippet = getSnippetByChars(page.content, originalQuery, 300);

        if (!snippet && page.title.toLowerCase().includes(lowerQuery)) {
            snippet = 'Term found in title: ' + page.title;
        }

        snippet = highlightQuery(snippet, originalQuery);

        const li = document.createElement('li');
        li.className = "list-none bg-white p-4 rounded-md shadow-md border border-gray-200";
        li.innerHTML = `
      <a href="${page.url}" class="text-blue-600 font-semibold text-lg hover:underline">${page.title}</a>
      <p class="mt-1 text-sm text-gray-700">${snippet}</p>
    `;
        resultsList.appendChild(li);
    });
}

function getSnippetByChars(content, query, chars = 100) {
    if (!content || !query) return '';

    const cleanContent = content.replace(/<\/?[^>]+(>|$)/g, ""); // strip HTML
    const lowerContent = cleanContent.toLowerCase();
    const lowerQuery = query.toLowerCase();

    let bestIndex = lowerContent.indexOf(lowerQuery);

    // If full query not found, try individual words
    if (bestIndex === -1) {
        const queryWords = lowerQuery.split(/\s+/);
        // Convert to array for processing
        const allTerms = Array.from(queryWords);

        // Check if any "long" terms (4 or more chars) exist
        const hasLongTerm = allTerms.some(term => term.length >= 4);

        // Filter terms accordingly
        const filteredTerms = hasLongTerm
            ? allTerms.filter(term => term.length >= 4)
            : allTerms;

        for (const word of filteredTerms.sort((a, b) => b.length - a.length)) {
            const index = lowerContent.indexOf(word);
            if (index !== -1) {
                bestIndex = index;
                break;
            }
        }
    }

    if (bestIndex === -1) return '';

    const start = Math.max(0, bestIndex - Math.floor(chars / 2));
    const end = Math.min(cleanContent.length, bestIndex + Math.floor(chars / 2));

    return cleanContent.substring(start, end).trim() + '...';
}


// On page load, if ?q= is present in URL, populate search box and run search
window.addEventListener('DOMContentLoaded', async () => {
    const query = getQueryParam('q');
    if (query) {
        document.getElementById('searchInput').value = query;
        await search(query);
    }
});