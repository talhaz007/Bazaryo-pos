import React from "react";
import ReactPaginate from "react-paginate";

import "./Paginator.scss";

const Paginator = (props) => {
  const {
    className,
    pageCount,
    pageRangeDisplayed,
    marginPagesDisplayed,
    onPageChange,
  } = props;
  const buttonImg = <div className="page-button-controller" />;
  return (
    <div className={`paginator-wrapper ${className || ""}`}>
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={pageRangeDisplayed || 4}
        marginPagesDisplayed={marginPagesDisplayed || 1}
        onPageChange={onPageChange}
        previousLabel={buttonImg}
        nextLabel={buttonImg}
        containerClassName="pagination"
        pageClassName="page"
        activeClassName="active-page"
        previousClassName="prev-page controller-page"
        nextClassName="next-page controller-page"
      />
    </div>
  );
};

export default Paginator;
