"use client";

type LayoutProps = {
    children: React.ReactNode;
};

export default function WetlandLayout({ children }: LayoutProps) {
    return (
        <div className="mx-auto max-w-7xl">
            {children}
        </div>
    );
}
