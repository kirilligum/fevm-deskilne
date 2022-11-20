export function makeFileObjects(obj: Object): File[] {
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
  const files = [
    new File([blob], 'resume.json'),
    new File(['contents-of-file-1'], 'plain-utf8.txt')
  ];
  return files;
}
