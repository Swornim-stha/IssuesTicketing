export default function ApplicationLogo(props) {
    return (
        <div className="flex items-center space-x-2" {...props}>
            <img
                src="/images/logo.png" // your logo image
                alt="Four Symmetrons Logo"
                className="w-10 h-10"
            />
        </div>
    );
}
