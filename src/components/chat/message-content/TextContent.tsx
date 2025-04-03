import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TextContentProps {
  content: string;
}

export function TextContent({ content }: TextContentProps) {
  return (
    <div className="markdown-content text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            
            return !inline && match ? (
              <pre className="rounded-md bg-muted p-2 overflow-x-auto">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className={cn(
                "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
                className
              )} {...props}>
                {children}
              </code>
            );
          },
          // Style other elements as needed
          ul({ children }) {
            return <ul className="list-disc ml-6 my-2">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal ml-6 my-2">{children}</ol>;
          },
          li({ children }) {
            return <li className="my-1">{children}</li>;
          },
          h1({ children }) {
            return <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-bold mt-3 mb-2">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-bold mt-2 mb-1">{children}</h3>;
          },
          a({ children, href }) {
            return (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-600"
              >
                {children}
              </a>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 