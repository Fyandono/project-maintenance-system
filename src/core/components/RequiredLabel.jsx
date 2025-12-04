const RequiredLabel = ({children}) => (
	<label>
		{children} <span style={{color: "red", marginLeft: "4px"}}>*</span>
	</label>
);

export default RequiredLabel;