import { useState } from "react";
import NumericInput from "react-numeric-input";
import { Tag, WithContext as ReactTags } from "react-tag-input";
import { ComplexResume } from "../types/ComplexResume";
import { MiniResume } from "../types/MiniResume";
import { SimpleResume } from "../types/SimpleResume";


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
    { id: "JS", text: "Javascript" },
    { id: "Solidity", text: "Solidity" },
    { id: "FVM", text: "FVM" },
    { id: "Python", text: "Python" },
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

  const submitHandler = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const resume: MiniResume = {
      name: name,
      technologies: tags.map((v) => v.text),
      yearsOfExperience: yearsOfExperience,
    };
    props.callback(resume);
  };

  return (
    <form
      onSubmit={submitHandler}
    >
      <h2>Create new resume </h2>
      <label htmlFor="message">Username:</label>
      <textarea
        style={{ height: '25px', color: 'black' }}
        id="name"
        name="name"
        placeholder="Your name here"
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
        onChange={(e) => setYearsOfExperience(typeof (e?.valueOf) === 'number' ? e?.valueOf : 0)}
      />
      <button id="resumeSubmit" type={'submit'} disabled={name === ''} >
        Click here to begin Deskilne Journey!
      </button>
    </form>
  );
}
