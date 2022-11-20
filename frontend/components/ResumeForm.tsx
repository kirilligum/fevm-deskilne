import { Basics, ComplexResume, UserLocation } from "../types/ComplexResume";
import { MiniResume } from "../types/MiniResume";
import { SimpleResume } from "../types/SimpleResume";

export function ResumeForm(): JSX.Element {

  const location: UserLocation = {
    address: "",
    postalCode: "",
    city: "",
    countryCode: "",
    region: ""
  }
  const basic: Basics = {
    name: "",
    label: "",
    image: "",
    email: "",
    phone: "",
    url: "",
    summary: "",
    location: location,
    profiles: []
  };
  const complexResume: ComplexResume = {
    basics: basic,
    work: [],
    volunteer: [],
    education: [],
    awards: [],
    certificates: [],
    publications: [],
    skills: [],
    languages: [],
    interests: [],
    references: [],
    projects: []
  };

  const resume:  MiniResume= {
    name: "",
    languages: "",
    yearsOfExperience: 0
  }

  return <form
    onSubmit={e => {
      e.preventDefault()
      const formData: FormData = new FormData(e.currentTarget!)
    }}>
    <label htmlFor="message">Enter a message to sign</label>
    <textarea
      id="message"
      name="message"
      placeholder="the quick brown fox..." />
  </form>

}
