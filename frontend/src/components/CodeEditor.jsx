import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './CodeEditor.module.css';

const getSyntaxLanguage = (lang) => {
  if (!lang) return 'javascript';
  const mapping = {
    'javascript': 'javascript',
    'typescript': 'typescript',
    'python': 'python',
    'java': 'java',
    'c': 'c',
    'c++': 'cpp',
    'cpp': 'cpp',
    'c#': 'csharp',
    'csharp': 'csharp',
    'go': 'go',
    'rust': 'rust',
    'swift': 'swift',
    'kotlin': 'kotlin',
    'php': 'php',
    'ruby': 'ruby',
    'r': 'r',
    'scala': 'scala',
    'dart': 'dart',
    'lua': 'lua',
    'perl': 'perl',
    'haskell': 'haskell',
    'bash/shell': 'bash',
    'bash': 'bash',
    'sql': 'sql',
    'matlab': 'matlab'
  };
  return mapping[lang.toLowerCase()] || 'javascript';
};

export default function CodeEditor({ value, onChange, placeholder, readOnly = false, language = 'javascript' }) {
  if (readOnly && value) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.highlightWrapper}>
          <SyntaxHighlighter
            language={getSyntaxLanguage(language)}
            style={tomorrow}
            showLineNumbers={true}
            customStyle={{
              margin: 0,
              background: 'transparent',
              padding: '1.25rem',
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              fontSize: '0.85rem',
              lineHeight: '1.75',
              overflow: 'auto',
              flex: 1,
            }}
            codeTagProps={{
              style: {
                fontFamily: 'inherit',
              }
            }}
          >
            {value}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <textarea
        className={styles.editor}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder || '// Paste your code here...'}
        readOnly={readOnly}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        aria-label="Code editor"
      />
    </div>
  );
}
