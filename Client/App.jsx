import React, { useState, useEffect } from 'react';
import { ShoppingCart, LayoutGrid, Server, User } from 'lucide-react';

// The main application component
const App = () => {
    // State to hold product data once fetched from the API
    const [products, setProducts] = useState([]);
    // State to manage the loading status
    const [isLoading, setIsLoading] = useState(false);
    // State to handle potential errors
    const [error, setError] = useState(null);

    // Placeholder function for the actual API call (Step 1 of the next task)
    // We will simulate the data fetching environment for now.
    const fetchProducts = () => {
        setIsLoading(true);
        setError(null);
        console.log("Attempting to fetch data from API...");
        
        // Simulating a successful API response delay
        setTimeout(() => {
            const simulatedData = [
                { id: 1, name: 'מוצר לדוגמה 1', price: 99.90, description: 'תיאור קצר למוצר הראשון.' },
                { id: 2, name: 'מוצר לדוגמה 2', price: 149.50, description: 'תיאור קצר למוצר השני.' },
                { id: 3, name: 'מוצר לדוגמה 3', price: 49.00, description: 'תיאור קצר למוצר השלישי.' },
            ];

            // Here we would normally use setProducts(data.products) after a successful fetch.
            setProducts(simulatedData);
            setIsLoading(false);
            console.log("Simulated data loaded successfully.");

            // This is where the core functionality of the next task (connecting DB->API->UI) will be implemented.
        }, 1500);
    };

    // useEffect to run the fetchProducts function only once when the component mounts
    useEffect(() => {
        // We can call the fetch function here to start loading immediately
        // For this initial structure, we'll keep it commented out for now, 
        // until the actual API is ready (Step 2 of the next task).
        // fetchProducts(); 
    }, []);


    // --- Helper Components for Clean Structure ---

    // Header Component with navigation structure
    const Header = () => (
        <header className="bg-gray-800 text-white shadow-lg sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <LayoutGrid className="w-6 h-6 text-indigo-400" />
                    <h1 className="text-2xl font-bold text-indigo-400">
                        {/* שם הפרויקט שלכן */}
                        שם הפרויקט
                    </h1>
                </div>
                
                {/* Navigation and User Icons */}
                <nav className="flex items-center space-x-6 rtl:space-x-reverse">
                    <button className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition duration-150">
                        <User className="w-5 h-5 mr-2 rtl:ml-2" />
                        <span>משתמש</span>
                    </button>
                    <button className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition duration-150 relative">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-xs text-white font-bold rounded-full h-5 w-5 flex items-center justify-center">0</span>
                    </button>
                </nav>
            </div>
        </header>
    );

    // Product Card Component (simulating the UI element for a single product)
    const ProductCard = ({ product }) => (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-6 flex flex-col items-start border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h2>
            <p className="text-sm text-gray-500 mb-4 flex-grow">{product.description}</p>
            <div className="mt-auto w-full flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-2xl font-bold text-indigo-600">
                    ₪{product.price.toFixed(2)}
                </span>
                <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 shadow-md">
                    הוסף לעגלה
                </button>
            </div>
        </div>
    );
    
    // Main Content Area (simulating the Product List View)
    const MainContent = () => (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-right mb-8 border-b pb-4">
                <h2 className="text-3xl font-extrabold text-gray-900">
                    <span className="flex items-center justify-end">
                        מוצרים זמינים
                        <Server className="w-6 h-6 text-gray-400 ml-2 rtl:mr-2" />
                    </span>
                </h2>
                <p className="text-lg text-gray-600 mt-1">
                    כאן תוצג רשימת המוצרים הנשלפת ממסד הנתונים.
                </p>
                <button 
                    onClick={fetchProducts}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150"
                    disabled={isLoading}
                >
                    {isLoading ? 'טוען נתונים...' : 'טען נתוני דוגמה'}
                </button>
            </div>

            {/* Display Area */}
            {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">שגיאה: {error}</div>}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    // Initial State / No Data Found Message
                    <div className="col-span-full p-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <h3 className="text-xl font-medium text-gray-700">אין מוצרים להצגה</h3>
                        <p className="text-gray-500 mt-2">
                            לחצו על 'טען נתוני דוגמה' או חברו את ה-API בשלב הבא כדי לראות נתונים אמיתיים.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );

    // Footer Component
    const Footer = () => (
        <footer className="bg-gray-800 mt-10 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
                <p>&copy; 2024 פרויקט ספרינט ראשון. כל הזכויות שמורות.</p>
            </div>
        </footer>
    );


    // Main App Render
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <style>{`
                /* גופן גלובלי לקריאות טובה יותר */
                .font-sans {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
                }
            `}</style>
            <Header />
            <MainContent />
            <Footer />
        </div>
    );
};