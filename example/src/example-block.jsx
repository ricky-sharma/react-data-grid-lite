export const ExampleBlock = ({ title, text, theme, children }) => (
    <section style={{ marginBottom: '1rem' }}>
        <div style={{ paddingBottom: "20px" }}>
            <header>
                <h2>{title}</h2>
            </header>
            <p>
                <strong>Theme:</strong> <em>{theme}</em>
            </p>
            <p>
                <strong>{text}</strong>
            </p>
        </div>
        {children}
    </section>
);
