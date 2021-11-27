import React from "react";
import AvatarProvider from "./AvatarProvider/AvatarProvider";
import Avatar from "./Avatar/Avatar";
import Paginators from "./Paginators";
import Category from "./Category/Category";
import Product from "./Product/Product";
import Sidebar from "./Sidebar/Sidebar";
import MiniCart from "./MiniCart/MiniCart";
import SelectInput from "./SelectInput/SelectInput";

const UiPackageExample = () => {
    return (
        <>
            <Paginators />
            <AvatarProvider />
            <Avatar size="medium" />
            <Category />
            <Product />
            <Sidebar />
            <MiniCart value={1} />
            <SelectInput />
        </>
    );
};
export default UiPackageExample;
