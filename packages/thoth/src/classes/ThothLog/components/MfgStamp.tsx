// import React from "react";
// import Image from "ink-image";

// const ILIAD_MFG_STAMP = "https://iliad.dev/brand/logo_icon.svg";
// export const MfgStamp = ({}) => {
//   return <Image preserveAspectRatio src={ILIAD_MFG_STAMP} width="16px" />;
// };

// import terminalImage from "terminal-image";
// import { Box } from "ink";
// import omit from "lodash.omit";
// import propTypes from "prop-types";
// import termImg from "term-img";

// termImg.prototype;
// const Image = (props) => {
//   return (
//     <Box>
//       {termImg.image(
//         props.src,
//         Object.assign(omit(props, ["alt", "src"]), {
//           fallback: () => props.alt,
//         })
//       )}
//     </Box>
//   );
// };
// React.createElement(
//   Box,
//   null,
//   termImg.string(
//     props.src,
//     Object.assign(omit(props, ["alt", "src"]), {
//       fallback: () => props.alt,
//     })
//   )
// );

// Image.propTypes = {
//   alt: propTypes.string,
//   src: propTypes.oneOfType([propTypes.object, propTypes.string]).isRequired,
// };
// Image.defaultProps = {
//   alt: "",
// };
// module.exports = Image;
