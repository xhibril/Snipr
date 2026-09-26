export default function SearchFiles(files, query, tags) {
  if (!query && tags.length === 0) return files;

  /// remove anything thats not a letter
  query = query.replace(/[^a-zA-Z0-9\s]/g, "");

  const filteredFiles = files.filter((file) => {
    if (!tags || tags.length === 0) {
      return true;
    }

    return (
      tags.every((tag) => file?.tags?.includes(tag)) // check that every tag exists in file
    );
  });


  console.log(query);
  console.log(filteredFiles)

  return !query ? filteredFiles : finalizedFiles(files, query);
}



function finalizedFiles(files, query) {
  const splitQuery = query.trim().toLowerCase().split(/\s+/);

  const scoredFiles = files.map((file) => {
    let score = 0;

    for (const word of splitQuery) {
      const name = file?.name?.toLowerCase() || "";

      if (name === word) {
        score += word.length;
        continue;
      }

      let fileIndex = 0;

      for (const c of word) {
        const index = name.indexOf(c, fileIndex);

        if (index === -1) {
          break;
        }

        score++;
        fileIndex = index + 1;
      }
    }

    return { file, score };
  });

return scoredFiles
  .filter((item) => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .map((item) => item.file);
}
