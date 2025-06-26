export const ExampleBlock = ({ title, text, theme, htmlContent, children }) => (
    <section style={{ marginBottom: '1rem' }}>
        <div style={{ paddingBottom: "20px" }}>
            <header>
                <div><h3>{title}</h3></div>
            </header>
            <h4>
                <p>
                    <strong>Theme: </strong><em>{theme}</em>
                </p>
            </h4>
            <h4>
                <p>{text}</p>
                <p dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </h4>
        </div>
        {children}
    </section>
);
