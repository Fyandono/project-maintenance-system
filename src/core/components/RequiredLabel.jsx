const RequiredLabel = ({ isRequired=true, children }) => (
  <label>
    {children}
    {isRequired && <span style={{ color: "red", marginLeft: "4px" }}>*</span>}
  </label>
);

export default RequiredLabel;