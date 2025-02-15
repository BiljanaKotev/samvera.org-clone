var fs = require("fs");
const matter = require("gray-matter");

const fileToWrite = "site-navigation.js";

function getNavMap() {
  const navMap = [];

  /**
   * Delete the file first (if it exists)
   */
  try {
    if (fs.existsSync(fileToWrite)) {
      fs.unlinkSync(fileToWrite);
    }
  } catch (err) {
    console.error(err);
  }

  /**
   * Read the /markdown directory and construct a site navigation map
   * and output it to a file: /site-navigation.js which the app can use
   */
  const directories = fs.readdirSync("markdown");
  directories.forEach((directory) => {
    /**
     * Exclude creating navigation for Home and News
     */
    if (!["home", "news"].includes(directory)) {
      const files = fs.readdirSync(`markdown/${directory}`);
      const navItems = files.map((fileName) => {
        const slug = fileName.replace(".md", "");

        // Read the frontmatter from the .md file here and grab "title" to use as the label
        const readFile = fs.readFileSync(
          `markdown/${directory}/${fileName}`,
          "utf-8"
        );
        const { data: frontmatter } = matter(readFile);
        const label = frontmatter.title;

        return { href: `/${directory}/${slug}`, label, slug };
      });

      navMap.push({
        label: directory.replaceAll("-", " "),
        items: navItems,
        slug: directory,
      });
    }
  });

  return navMap;
}

const navMap = getNavMap("markdown");
const content = `
export const siteNavigation=${JSON.stringify(navMap)};
`;

try {
  fs.writeFileSync(fileToWrite, content);
} catch (err) {
  console.error(err);
}
