import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 sm:size-12 md:size-14 lg:size-16 xl:size-20 items-center justify-center rounded-md bg-transparent text-sidebar-primary-foreground">
                <AppLogoIcon className="size-15 fill-current text-sidebar-primary" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
        <span className="mb-0.5 truncate font-semibold leading-none">PNE RE</span>
    </div>
        </>
    );
}
