Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length>0">
            <b>Please fix following error(s)</b>
            <ul>
                <li v-for="error in errors">{{error}}</li>
            </ul>
        </p>

        </p>
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name"></input>
        </p>
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        <p>
            <input type="submit" value="Submit">
        </p>
    </form>

    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
        }
    },
    methods: {
        onSubmit: function () {
            if (this.name != null && this.review != null && this.rating != null) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                }
                this.$emit("review-submitted", productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if (this.name == null) this.errors.push("Name required.")
                if (this.review == null) this.errors.push("Review required.")
                if (this.rating == null) this.errors.push("Rating required.")
            }
        }
    }
})

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>
    `
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img v-bind:src="image">
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else :class="{ outOfStock: !inStock}">Out of Stock</p>
            <p>Shipping {{ shipping }}</p>
            <product-details :details="details"></product-details>

            <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box"
                :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
            </div>

            <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to Cart</button>
            <button v-on:click="removeFromCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Remove from Cart</button>
        </div>

        <div>
            <h2>Reviews</h2>
            <p v-if="reviews.length==0">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">{{review}}</li>
            </ul>
        </div>

        <product-review @review-submitted="addReview"></product-review>
    </div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            selectedVariant: 0,
            details: ["80% cotton", "20% polyster", "Unisex"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 5,
                }
            ],
            cart: 0,
            reviews: []
        }
    },
    methods: {
        addToCart: function () {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeFromCart: function () {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct: function (index) {
            this.selectedVariant = index
        },
        addReview: function (productReview) {
            this.reviews.push(productReview)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 0
        },
        shipping() {
            if (this.premium) {
                return "free"
            } else {
                return "2.99"
            }
        }
    },
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart: function (id) {
            this.cart.push(id)
        },
        removeCart: function (id) {
            for (var i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] == id) {
                    this.cart.splice(i, 1)
                    return
                }
            }
        }
    }
})