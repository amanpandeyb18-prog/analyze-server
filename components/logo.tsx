import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";

interface LogoProps {
  // Your prop types here
}

const Logo: FC<LogoProps> = (props) => {
  return (
    <Link href="/">
      <Image src={"/logo.png"} alt="logo" height={64} width={256} />
    </Link>
  );
};

export default Logo;
