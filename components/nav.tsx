import Image from "next/image";

export default function Nav() {
  return (
    <div className="flex items-center justify-between border-muted border-b py-4">

        <div className=" text-2xl uppercase">
            Testrausfinder700
        </div>
        <div className="mx-6">
            <a href="https://heim.software" className="" target="_blank" rel="noopener noreferrer">
                <Image src={"/house.svg"} width={32} height={32} alt={"house"} className="" />
            </a>
        </div>
    </div>
  );
}
