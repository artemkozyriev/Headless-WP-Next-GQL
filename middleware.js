import { NextResponse } from 'next/server';

const Middleware = async (req, res, next) => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_URL + req.nextUrl.pathname, {method: 'POST', redirect: 'manual'});
        // Check if the response has a 3xx status code
        if (response.status >= 300 && response.status < 400) {
            // If the response has a 3xx status code, you can access the location header
            const redirectTo = response.headers.get('location');
            if (redirectTo.startsWith('/')) {
                return NextResponse.redirect(req.nextUrl.origin + redirectTo);
            }
            return NextResponse.redirect(redirectTo);
        } else {
            // If the response does not have a 3xx status code, you can handle it accordingly
            // console.error('Request did not result in a redirect. Status:', response.status);
        }
    } catch (error) {
        // If there is an error during the fetch request, you can handle it here
        console.error('Error:', error);
    }

    const shouldHandleUppercase =
        !req.nextUrl.pathname.includes('/api/') &&
        !req.nextUrl.pathname.includes('/_next');

    if (shouldHandleUppercase && req.nextUrl.pathname !== req.nextUrl.pathname.toLowerCase()) {
        const url = req.nextUrl.clone()
        url.pathname = url.pathname.toLowerCase()
        return NextResponse.redirect(url)
    }
    return NextResponse.next();
};

export default Middleware;

export const config = {
    matcher: [
        '/((?!_next/image|_next/static|api|favicon.ico|graphql).*)'
    ]
}
