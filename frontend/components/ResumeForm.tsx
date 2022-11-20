import { useState } from "react";
import { Tag, WithContext as ReactTags } from "react-tag-input";
import { MiniResume } from "../types/MiniResume";
import NumericInput from "react-numeric-input";
import { SimpleResume } from "../types/SimpleResume";
import { ComplexResume } from "../types/ComplexResume";


const techTags: Tag[] = [
  { id: "Javascript", text: "Javascript" },
  { id: "Javascript", text: "Javascript" },
];

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];
export type Resume = SimpleResume | MiniResume | ComplexResume

export function ResumeForm(props: { callback: (v: Resume) => void }): JSX.Element {
  const [name, setName] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [tags, setTags] = useState([
    { id: "Thailand", text: "Thailand" },
    { id: "India", text: "India" },
    { id: "Vietnam", text: "Vietnam" },
    { id: "Turkey", text: "Turkey" },
  ]);


  const handleDelete = (i: number) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag: Tag) => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag: Tag, currPos: number, newPos: number) => {
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    // re-render
    setTags(newTags);
  };

  const handleTagClick = (index: number) => {
    console.log("The tag at index " + index + " was clicked");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const resume: MiniResume = {
          name: name,
          technologies: tags.map((v) => v.text),
          yearsOfExperience: yearsOfExperience,
        };

        props.callback(resume);
      }}
    >
      <label htmlFor="message">Enter a message to sign</label>
      <textarea
        id="message"
        name="message"
        placeholder="the quick brown fox..."
        onChange={(e) => setName(e.target.value)}
      />
      <ReactTags
        tags={tags}
        suggestions={techTags}
        delimiters={delimiters}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        handleDrag={handleDrag}
        handleTagClick={handleTagClick}
        inputFieldPosition="bottom"
        autocomplete
      />
      <NumericInput
        min={0}
        max={10}
        value={1}
        onChange={(e) => setYearsOfExperience(e?.valueOf || 0)}
      />
      <input type={'submit'}>
        Ready to begin Deskilne Journey!
      </input>
    </form>
  );
}
