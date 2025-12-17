import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    if (!links || links.length <= 3) { // Typically, 3 links means only prev, 1, next, so no real pagination
        return null;
    }

    return (
        <nav className="mt-4 flex justify-center">
            <div className="flex flex-wrap -mb-1">
                {links.map((link, index) => (
                    <div key={index}>
                        {link.url === null ? (
                            <div
                                className="mb-1 mr-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded inline-block"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <Link
                                className={
                                    "mb-1 mr-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 inline-block " +
                                    (link.active
                                        ? "bg-indigo-500 text-white"
                                        : "bg-white")
                                }
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </nav>
    );
}