"use client";

import dynamic from "next/dynamic";

/*
 * three.js is only ever needed in the browser. Loading the canvas
 * with ssr disabled keeps it out of the server bundle and off the
 * critical path for first paint.
 */
const GLCanvas = dynamic(() => import("./GLCanvas"), { ssr: false });

export default function GLRoot() {
  return <GLCanvas />;
}
