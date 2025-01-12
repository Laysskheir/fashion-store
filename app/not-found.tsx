import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-2xl px-8 py-16 text-center">
                <div className="mb-8">
                    <h1 className="text-8xl font-extrabold text-primary mb-2">404</h1>
                    <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
                    <h2 className="text-3xl font-semibold text-foreground mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Oops! It seems this page has gone out of style.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link
                        href="/"
                        className="flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-300 w-full sm:w-auto"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Homepage
                    </Link>
                    <Link
                        href="/products"
                        className="flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors duration-300 w-full sm:w-auto"
                    >
                        <Search className="w-5 h-5 mr-2" />
                        Search Products
                    </Link>
                </div>
            </div>
        </div>
    )
}
