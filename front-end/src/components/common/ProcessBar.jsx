import { useNavigate } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

function LinkWithProgress({ to, children, ...props }) {
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();

        // Bắt đầu progress
        NProgress.start();
        NProgress.set(0.3);

        setTimeout(() => NProgress.set(0.7), 300);
        setTimeout(() => {
            NProgress.done();
            navigate(to); // chỉ chuyển trang sau khi progress xong
        }, 600);
    };

    return (
        <a href={to} onClick={handleClick} {...props}>
            {children}
        </a>
    );
}

export default LinkWithProgress;
