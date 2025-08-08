import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import ReactMarkdown from "react-markdown";

const Textarea = ({ 
  className,
  placeholder,
  value = "",
  onChange,
  rows = 4,
  showPreview = false,
  ...props 
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(showPreview);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="space-y-2">
      {showMarkdownPreview && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={!isPreviewMode ? "primary" : "ghost"}
            size="sm"
            onClick={() => setIsPreviewMode(false)}
          >
            <ApperIcon name="Edit3" className="h-3 w-3" />
            Edit
          </Button>
          <Button
            type="button"
            variant={isPreviewMode ? "primary" : "ghost"}
            size="sm"
            onClick={() => setIsPreviewMode(true)}
          >
            <ApperIcon name="Eye" className="h-3 w-3" />
            Preview
          </Button>
        </div>
      )}
      
      {isPreviewMode && showMarkdownPreview ? (
        <div className={cn(
          "min-h-[100px] p-3 border border-neutral-300 rounded-lg bg-neutral-50",
          "prose prose-sm max-w-none",
          className
        )}>
          {value ? (
            <ReactMarkdown
              components={{
                h1: ({children}) => <h1 className="text-lg font-bold text-neutral-800 mb-2">{children}</h1>,
                h2: ({children}) => <h2 className="text-base font-semibold text-neutral-800 mb-2">{children}</h2>,
                h3: ({children}) => <h3 className="text-sm font-semibold text-neutral-700 mb-1">{children}</h3>,
                p: ({children}) => <p className="text-sm text-neutral-600 mb-2 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1 mb-2">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside text-sm text-neutral-600 space-y-1 mb-2">{children}</ol>,
                li: ({children}) => <li className="ml-2">{children}</li>,
                strong: ({children}) => <strong className="font-semibold text-neutral-800">{children}</strong>,
                em: ({children}) => <em className="italic text-neutral-700">{children}</em>,
                code: ({children}) => <code className="bg-neutral-200 text-neutral-800 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                pre: ({children}) => <pre className="bg-neutral-800 text-neutral-100 p-3 rounded-lg text-xs font-mono overflow-x-auto mb-2">{children}</pre>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-neutral-300 pl-3 text-neutral-600 italic mb-2">{children}</blockquote>,
                a: ({children, href}) => <a href={href} className="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer">{children}</a>
              }}
            >
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-neutral-400 text-sm">No notes added yet...</p>
          )}
        </div>
      ) : (
        <textarea
          className={cn(
            "flex w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm",
            "placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
            "transition-all duration-200",
            className
          )}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          rows={rows}
          {...props}
        />
      )}
      
      {showMarkdownPreview && !isPreviewMode && (
        <div className="text-xs text-neutral-500">
          <p>Supports Markdown: **bold**, *italic*, `code`, [links](url), # headers, - lists</p>
        </div>
      )}
    </div>
  );
};

export default Textarea;