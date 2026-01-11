"use client";

interface Props {
  content: string;
}

export default function RichTextRenderer({ content }: Props) {
  return (
    <div
      className="prose max-w-full"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
