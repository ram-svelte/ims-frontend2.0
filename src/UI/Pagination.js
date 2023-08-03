import ReactPaginate from "react-paginate";

import React from 'react'

function Pagination( props) {
    return (
        <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        initialPage={props.pageNumber}
        pageCount={props.pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={props.OnhandlePageClick}
        containerClassName={"pagination justify-content-center mt-3"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    )
}

export default Pagination
