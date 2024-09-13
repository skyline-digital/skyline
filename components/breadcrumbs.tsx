"use client";

import React, { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { usePathname } from "next/navigation";

type BreadcrumbItemProps = {
  title: string;
  link: string;
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  const splitPath = pathname.split("/").filter((path) => path !== "");

  const items = splitPath.map((path, index) => {
    return {
      title: path.charAt(0).toUpperCase() + path.slice(1),
      link: `/${splitPath.slice(0, index + 1).join("/")}`,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <BreadcrumbItem>
                <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && <BreadcrumbSeparator />}
            {index === items.length - 1 && (
              <BreadcrumbPage>
                <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
              </BreadcrumbPage>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
