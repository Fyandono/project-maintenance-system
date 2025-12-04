const Pagination = ({currentPage, totalPage, onPageChange}) => (
	<div style={{marginTop: "20px", textAlign: "center"}}>
		<button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} style={{padding: "10px", marginRight: "10px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer"}}>
			Previous
		</button>
		<span style={{margin: "0 15px"}}>
			Page {currentPage} of {totalPage}
		</span>
		<button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPage} style={{padding: "10px", marginLeft: "10px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer"}}>
			Next
		</button>
	</div>
);

export default Pagination;