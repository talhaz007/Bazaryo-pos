import React, { useState } from "react";
import Paginator from "./Paginator/Paginator";

const Paginators = () => {
  // initializing
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 3;
  const items = [
    "item1",
    "item2",
    "item3",
    "item4",
    "item5",
    "item6",
    "item7",
    "item8",
    "item9",
    "item10",
    "item11",
    "item12",
    "item13",
    "item14",
    "item15",
    "item16",
    "item17",
    "item18",
    "item19",
    "item20",
    "item21",
    "item22",
    "item23",
    "item24",
    "item25",
    "item26",
    "item27",
    "item28",
    "item29",
    "item30",
    "item31",
  ];
  // slicing
  const pageCount = Math.ceil(items.length / perPage);
  const slice = items.slice(offset, offset + perPage);
  const postData = slice.map((pd) => <p key={pd}>{pd}</p>);
  // handling click
  const handleClick = (e) => {
    const selectedPage = e.selected;
    const newOffset = selectedPage * perPage;
    setOffset(newOffset);
    setCurrentPage(selectedPage);
  };
  return (
    <div>
      <b className="test">Paginator</b>
      <div className="items">{postData}</div>
      <div className="items">
        Current page:
        {currentPage}
      </div>
      <Paginator
        pageCount={pageCount}
        pageRangeDisplayed={4}
        marginPagesDisplayed={1}
        onPageChange={handleClick}
      />
    </div>
  );
};

export default Paginators;
