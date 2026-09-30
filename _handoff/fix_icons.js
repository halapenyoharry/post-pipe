const fs = require('fs');

let code = fs.readFileSync('src/components/ReaderPanel/ReaderPanel.jsx', 'utf8');

code = code.replace(
  "import { marksIcon, bookmarkFilledIcon, bookmarkIcon, copyIcon, trashIcon } from '../../utils/icons'; // We'll extract icons into a utility",
  ""
);

code = code.replace(/marksIcon/g, "ICONS.bookmarkList");
code = code.replace(/bookmarkFilledIcon/g, "ICONS.bookmark");
code = code.replace(/bookmarkIcon/g, "ICONS.bookmark");
code = code.replace(/copyIcon/g, "ICONS.copy");
code = code.replace(/trashIcon/g, "ICONS.trash");

fs.writeFileSync('src/components/ReaderPanel/ReaderPanel.jsx', code);
