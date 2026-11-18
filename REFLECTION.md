# Week 1 reflection

1. What is the difference between building a UI imperatively (plain DOM code) and declaratively (React)?

- Imperative UI means manually changing HTML elements using DOM code. Declarative UI means describing how the UI should look and React updates it based on the data and state.

2. Why must a component name start with a capital letter?

- React uses capital letters to identify custom components. Lowercase names are treated as HTML elements.

3. What does a fragment <>...</> do, and why not just use a <div>?

- A fragment allows multiple elements to be returned together without adding an extra HTML element to the page.

4. Name one benefit of splitting the UI into small components.

- It makes the code easier to understand and debug.

# Week 6 reflection

1. Explain, step by step, what happens from the moment you click Place order until the new order appears on your Orders page.Name the functions in your own code that run, and say why you never call setOrders yourself.

- Whenever I click on the Place Order button, the CheckoutForm component invokes the handlePlaceOrder() function in the CartPage.jsx file. This function makes a call to the placeOrders() function from orders.js and stores the order information into the Firestore orders collection. This function creates separate orders using the writeBatch() method whenever there are multiple vendor items in the cart. Once the batch is committed, the cart is cleared and the app moves to the Orders page. The useMyOrders() hook invokes the subscribeToMyOrders() function on the Orders page and this function listens to the order collection using the onSnapshot() method. Upon receiving the new order from the Firestore, the state is updated by the snapshot callback and this order is rendered by the React app.

2. Why is orders a top-level collection, and why does each order copy vendorName and each item’s name and price instead of storing only IDs?

The orders collection is at the top level because orders placed by different vendors need to be stored in a single collection. Every order has the studentUid field, which makes it easy for the app to make queries about the orders of a particular student. Order information includes vendorName,items and prices, rather than relying solely on document IDs, as this ensures that even when the vendor’s name or the menu items are changed,the order information will remain the same. Furthermore,it gives insight into what the student ordered back then.

3. Your personal feature: which Firestore path and fields hold its data, and which line of your code reads it? Paste that line.

The one that suits me best is Favourite Items since my last digit in my matric number is 3. The favourite details will be found at the Firestore path of favourites/{uid}, where {uid} refers to the UID of the logged-in user. The document has an array called itemIds that keeps the IDs of the favourite menu items. To get the ID of the favourite items, I use subscribeToFavourites() in favourites.js through the method onSnapshot().
onData(snapshot.exists() ? (snapshot.data().itemIds ?? []) : []);
arrayUnion method is used to add a favourite object while arrayRemove is used to remove an object. It allows the list of favourites to be updated in real-time in different browsers of the same logged-in user.

4. Bug Encountered and Fix

I experienced an issue where favourite items were successfully saved to Firestore but they did not show up on the Favourites page. The reason for this was that in FavouritesPage.jsx, I was subscribing to menu items in vendor.menu but my menu items were stored in different subcollections in Firestore. To solve this problem, I called the subscribeToMenu()y method, which subscribed to menu items in the menu subcollection of the respective vendor.
