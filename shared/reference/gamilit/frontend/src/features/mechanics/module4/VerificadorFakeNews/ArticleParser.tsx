import React, { useState } from 'react';
import { FileText, Search, AlertTriangle } from 'lucide-react';
import { NewsArticle } from './verificadorFakeNewsTypes';

interface ArticleParserProps {
  article: NewsArticle;
  onClaimSelect: (text: string, start: number, end: number) => void;
  highlightedClaims: Array<{ start: number; end: number; verified?: boolean }>;
}

export const ArticleParser: React.FC<ArticleParserProps> = ({
  article,
  onClaimSelect,
  highlightedClaims,
}) => {
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') {
      setSelectedText('');
      setSelectionRange(null);
      return;
    }

    const text = selection.toString();
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    const articleElement = document.getElementById('article-content');

    if (!articleElement) return;

    preCaretRange.selectNodeContents(articleElement);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    const start = preCaretRange.toString().length;
    const end = start + text.length;

    setSelectedText(text);
    setSelectionRange({ start, end });
  };

  const handleExtractClaim = () => {
    if (selectedText && selectionRange) {
      onClaimSelect(selectedText, selectionRange.start, selectionRange.end);
      setSelectedText('');
      setSelectionRange(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  const renderHighlightedContent = () => {
    const content = article.content;
    const parts: Array<{ text: string; highlighted: boolean; verified?: boolean }> = [];
    let lastIndex = 0;

    const sortedClaims = [...highlightedClaims].sort((a, b) => a.start - b.start);

    sortedClaims.forEach((claim) => {
      if (claim.start > lastIndex) {
        parts.push({
          text: content.slice(lastIndex, claim.start),
          highlighted: false,
        });
      }
      parts.push({
        text: content.slice(claim.start, claim.end),
        highlighted: true,
        verified: claim.verified,
      });
      lastIndex = claim.end;
    });

    if (lastIndex < content.length) {
      parts.push({
        text: content.slice(lastIndex),
        highlighted: false,
      });
    }

    return parts.map((part, index) => {
      if (part.highlighted) {
        const bgColor = part.verified
          ? 'bg-green-200'
          : 'bg-yellow-200';
        return (
          <span
            key={index}
            className={`${bgColor} px-1 rounded font-medium`}
          >
            {part.text}
          </span>
        );
      }
      return <span key={index}>{part.text}</span>;
    });
  };

  return (
    <div className="bg-white rounded-detective shadow-card p-6 space-y-4">
      <div className="flex items-start gap-3 border-b border-gray-200 pb-4">
        <FileText className="w-6 h-6 text-detective-orange flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-detective-text mb-2">{article.title}</h2>
          <div className="flex items-center gap-4 text-sm text-detective-text-secondary">
            <span className="font-medium">{article.source}</span>
            <span>{article.date}</span>
          </div>
        </div>
      </div>

      <div className="bg-detective-bg p-4 rounded-detective border border-detective-orange/20">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-5 h-5 text-detective-blue" />
          <h3 className="font-bold text-detective-text">Instrucciones:</h3>
        </div>
        <p className="text-detective-text-secondary text-sm">
          Selecciona el texto que contenga afirmaciones verificables y haz clic en "Extraer Afirmación"
          para analizarlas. Las afirmaciones extraídas se resaltarán en amarillo.
        </p>
      </div>

      <div
        id="article-content"
        className="text-detective-text leading-relaxed text-lg select-text"
        onMouseUp={handleTextSelection}
      >
        {highlightedClaims.length > 0 ? renderHighlightedContent() : article.content}
      </div>

      {selectedText && (
        <div className="bg-blue-50 border-2 border-detective-blue rounded-detective p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-detective-blue flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-detective-text font-medium mb-2">Texto seleccionado:</p>
              <p className="text-detective-text-secondary italic mb-3">"{selectedText}"</p>
              <button
                onClick={handleExtractClaim}
                className="px-4 py-2 bg-detective-blue text-white rounded-detective hover:bg-detective-blue/90 transition-colors font-medium"
              >
                Extraer Afirmación
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-detective-text-secondary text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-200 rounded" />
          <span>Afirmación extraída</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-200 rounded" />
          <span>Afirmación verificada</span>
        </div>
      </div>
    </div>
  );
};
