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
    const terms = query.split(/\s+/).filter(Boolean);
    for (const term of terms) {
        const regex = new RegExp(`(${term})`, 'gi');
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

    // Break the query into multiple meaningful tokens
    const terms = new Set();
    terms.add(lowerQuery);
    terms.add(lowerQuery.replace(/[.]/g, ' ')); // Replace dots with space for Lunr tokenization

    // Also split on dots/spaces/underscores to get partial tokens
    lowerQuery.split(/[.\s_]/).forEach(part => {
        if (part.length > 2) terms.add(part);
    });

    const allResults = [];
    const seenRefs = new Set();

    // Run lunr queries for each term
    idx.query(q => {
        for (const term of terms) {
            // Exact term (no wildcard)
            q.term(term, { boost: 5 });

            // Wildcard for partial match
            q.term(term, {
                wildcard: lunr.Query.wildcard.TRAILING,
                boost: 3
            });

            // Fuzzy match (edit distance = 1)
            if (term.length > 3) {
                q.term(term, {
                    editDistance: 1,
                    boost: 1
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
        let snippet = getSnippetByChars(page.content, originalQuery, 100);

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

    const cleanContent = content.replace(/<\/?[^>]+(>|$)/g, ""); // strip HTML if needed
    const lowerContent = cleanContent.toLowerCase();
    const lowerQuery = query.toLowerCase();

    // Break query into words
    const queryWords = lowerQuery.split(/\s+/);

    let bestIndex = -1;

    for (const word of queryWords) {
        const index = lowerContent.indexOf(word);
        if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
            bestIndex = index;
        }
    }

    if (bestIndex === -1) return '';

    const start = Math.max(0, bestIndex - chars / 2);
    const end = Math.min(cleanContent.length, bestIndex + chars / 2);

    return cleanContent.substring(start, end) + '...';
}

// On page load, if ?q= is present in URL, populate search box and run search
window.addEventListener('DOMContentLoaded', async () => {
    const query = getQueryParam('q');
    if (query) {
        document.getElementById('searchInput').value = query;
        await search(query);
    }
});