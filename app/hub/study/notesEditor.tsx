"use client";

import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { Module } from "./content";
import { useEffect, useState } from "react";

const content = "<h2>Hi, and welcome to Erudition!</h2><p>This is a WYSIWYG editor in which you can write your own notes!</p>";

export default function NotesEditor({
    selectedModule,
    updateNotes,
}: {
    selectedModule: Module;
    // updateNotes: (notes: string) => Promise<Module | undefined>;
    updateNotes: (notes: string) => void;
}) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        content: selectedModule.notes ?? content,
    });

    // Need state to force re-render (updates to editor.isEditable don't re-render)
    const [editing, setEditing] = useState(true);

    const handleEditorContentSave = async () => {
        if (!editor) return;
        updateNotes(editor.getHTML());
    };

    useEffect(() => {
        editor?.setEditable(editing);
    }, [editing]);

    return (
        <RichTextEditor
            styles={{
                root: {
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                },
                content: {
                    color: "#e4e4e7",
                    backgroundColor: "transparent",
                    maxHeight: "65vh",
                    overflowY: "scroll",
                },
                toolbar: {
                    backgroundColor: "#18181b",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                },
                controlsGroup: {
                    backgroundColor: "#52525b",
                    color: "#d4d4d8",
                    borderRadius: "0.25rem",
                },
                control: {
                    border: "0.25px solid rgba(255, 255, 255, 0.1)",
                },
            }}
            editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={96}>
                {/* Edit button */}
                <button className={`btn h-auto p-px ${editing ? "border-white/50" : ""}`} onClick={() => setEditing(!editing)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                    </svg>
                </button>
                {editing && (
                    <>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Code />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />

                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>
                    </>
                )}
                <RichTextEditor.ControlsGroup>
                    {/* Save button */}
                    <button onClick={handleEditorContentSave} className="btn h-auto py-px px-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Save</span>
                    </button>
                </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
        </RichTextEditor>
    );
}
