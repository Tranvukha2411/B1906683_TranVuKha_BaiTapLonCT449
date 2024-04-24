<template>
  <div class="app-header">
    <div class="app-header-left">
      <AppHeader></AppHeader>
    </div>
    <div class="app-header-right">
      <div class="search-input">
        <SearchInput v-model="searchText"></SearchInput>
        <i
          class="fa-sharp fa-solid fa-rotate-right refresh-icon"
          @click="refreshList"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          title="Làm mới"
        ></i>
      </div>
      <!-- <div class="add-product">
            
        </div> -->
      <div class="icon">
        <div class="dropdown dropstart">
          <div class="dropdown-tooltip" data-bs-toggle="dropdown">
            <i
              class="fa-solid fa-sort"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              title="Sắp xếp"
            ></i>
          </div>
          <ul class="dropdown-menu">
            <li class="dropdown-item" @click="sortItem('increase')">
              <i class="fa-solid fa-arrow-up-wide-short"></i> Giá tăng dần
            </li>
            <li class="dropdown-item" @click="sortItem('decrease')">
              <i class="fa-solid fa-arrow-down-wide-short"></i> Giá giảm dần
            </li>
          </ul>
        </div>
        <div class="cart-icon" v-if="!checkAdmin">
          <i
            class="fas fa-shopping-cart"
            @click="openCart"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title="Giỏ hàng"
            ref="cartIcon"
          ></i>
          <div class="count">
            <CartCount :userID="userId" :totalKey="totalCountKey"></CartCount>
          </div>
        </div>
        <div class="manager" v-if="checkAdmin">
          <i
            class="fa-solid fa-people-roof"
            @click="manager"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title="Trang quản lý"
            ref="managerIcon"
          ></i>
        </div>
        <div class="dropdown">
          <i class="fa-solid fa-bars" data-bs-toggle="dropdown"></i>
          <ul class="dropdown-menu">
            <li class="dropdown-item">
              <div
                class="profile-icon"
                data-bs-toggle="modal"
                data-bs-target="#myModalProfile"
                @click="unchange"
              >
                <i class="fa fa-user" aria-hidden="true"></i>Thông tin
              </div>
            </li>
            <li class="dropdown-item">
              <router-link
                :to="{
                  name: 'welcome',
                }"
                class="logout-class"
              >
                <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
              </router-link>
            </li>
          </ul>
        </div>
        <div
          class="add-icon"
          v-if="checkAdmin"
          @click="showModel = true"
          data-bs-toggle="modal"
          data-bs-target="#myModal"
        >
          <i
            class="fa-solid fa-plus"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title="Thêm sản phẩm"
          ></i>
        </div>
      </div>
      <!--Hiển thị Profile-->
      <div class="modal fade" id="myModalProfile">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Thông tin chi tiết</h4>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">
              <Profile :user="user" v-if="!isEdit"></Profile>
              <regisForm
                :contact="user"
                @submit:contact="updateUser"
                v-if="isEdit"
              ></regisForm>
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
              <button class="btn btn-warning" @click="change">
                <i class="fa-solid fa-pen-to-square"></i>Chỉnh sửa
              </button>
              <button
                type="button"
                class="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="myModal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Thêm sách mới</h4>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">
              <AddProductForm
                :products="product"
                @submit:products="createProduct"
              ></AddProductForm>
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="app-body">
    <div
      class="highlighted-products"
      v-if="!searchText"
      @click="changeProductClick('topProduct')"
    >
      <h2>Top sản phẩm nổi bật</h2>
      <TopProductList
        :products="topProducts"
        v-model:activeIndex="activeIndex"
        :userId="getId"
        v-model="keyCount"
        :getCheck="getCheck"
        @refresh-list="refreshList"
      >
      </TopProductList>
    </div>
    <h2>Tất cả sản phẩm</h2>
    <div class="all-product" @click="changeProductClick('')">
      <ProductList
        ref="productList"
        :products="sortedProduct"
        v-model:activeIndex="activeIndex"
        :userId="getId"
        v-model="keyCount"
        :getCheck="getCheck"
        @product-id-selected="handleProductIdSelected"
        @refresh-list="refreshList"
      >
      </ProductList>
    </div>

    <div class="modal fade" id="myModal3">
      <div
        class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h2>Thông tin chi tiết sách</h2>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="product-detail-body" v-if="activeProduct">
              <Detail
                :productDetail="activeProduct"
                :userID="userId"
                :isComment="true"
              ></Detail>
            </div>
          </div>
          <div class="modal-footer">
            <div class="edit">
              <i
                class="fa-solid fa-pen-to-square"
                @click="doEdit"
                data-bs-toggle="modal"
                data-bs-target="#myModal3"
                v-if="checkAdmin"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="app-footer">
    <!-- <div class="footer-info-group">
            <span>Liên hệ với chúng tôi thông qua <a href="https://www.facebook.com/tran.kha.1610092?mibextid=LQQJ4d"><i class="fa-brands fa-facebook"></i></a></span>
        </div> -->
    <div class="footer-info-group">
      <div class="left-info">
        <h5 style="color: black">Điều khoản dịch vụ</h5>
        <a href="https://policies.google.com/privacy?hl=vi"
          >Chính sách bảo mật</a
        >
      </div>
      <div class="right-info">
        <h5>Thông tin liên hệ</h5>
        <div class="info">
          <span
            ><i class="fa-brands fa-facebook"></i
            ><a href="https://www.facebook.com/tran.kha.1610092?mibextid=LQQJ4d"
              >: Facebook</a
            ></span
          >
          <br />
          <span
            ><i class="fa-regular fa-envelope"></i>:
            khab1906683@student.ctu.edu.vn</span
          >
          <br />
          <span><i class="fa-solid fa-phone"></i>: 0919219999</span> <br />
          <span
            ><i class="fa-solid fa-location-dot"></i>: 3/2, Ninh Kieu, Can
            Tho</span
          >
          <br />
        </div>
      </div>
    </div>
    <div class="delete-group">
      <div :class="{ 'delete-all': getCheck, 'delete-all-hide': !getCheck }">
        <button class="btn btn-danger" @click="deleteSelectedProducts">
          Xóa các sản phẩm
        </button>
      </div>
      <div class="delete-buttom">
        <AppFooter
          v-model:check="getCheck"
          :userId="id"
          v-if="checkAdmin"
        ></AppFooter>
      </div>
    </div>
  </div>
</template>

<script>
import AddProductForm from "../components/AddProductForm.vue";
import bookstoreService from "../services/bookstore.service";
import ProductList from "../components/ProductList.vue";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import SearchInput from "../components/SearchInput.vue";
import Profile from "../components/Profile.vue";
import regisForm from "../components/regisForm.vue";
import CartCount from "../components/CartCount.vue";
import Swal from "sweetalert2";
import unidecode from "unidecode";
import Detail from "../components/Detail.vue";
import { Tooltip } from "bootstrap";
import TopProductList from "../components/TopProductList.vue";

export default {
  props: {
    id: { type: String, required: true },
  },
  components: {
    AddProductForm,
    ProductList,
    AppHeader,
    AppFooter,
    SearchInput,
    Profile,
    CartCount,
    Detail,
    regisForm,
    TopProductList,
  },
  watch: {
    keyCount() {
      this.totalCountKey++;
      this.keyCount = 0;
    },
    activeIndex: "test",
  },
  data() {
    return {
      product: {
        name: "",
        price: "",
        img: null,
        describe: "",
        author: "",
      },
      products: [],
      activeIndex: -1,
      user: [],
      userId: null,
      checkAdmin: false,
      showModel: false,
      searchText: "",
      keyCount: 0,
      totalCountKey: 0,
      getCheck: false,
      productSelected: [],
      isEdit: false,
      productClick: "",
    };
  },
  computed: {
    productString() {
      return this.products.map((product) => {
        const { name, author, type } = product;
        const vietnameseString = [name, author, type].join("");
        const unaccentedString = unidecode(vietnameseString).toLowerCase(); // Chuyển chuỗi tiếng Việt có dấu thành chuỗi không dấu và chữ thường
        return unaccentedString;
      });
    },

    filteredProduct() {
      if (!this.searchText) {
        return this.products;
      }
      const searchTextLower = unidecode(this.searchText).toLowerCase(); // Chuyển searchText thành chuỗi không dấu và chữ thường
      return this.products.filter((_product, index) =>
        this.productString[index].includes(searchTextLower)
      );
    },

    topProducts() {
      const temp = this.products.slice().sort((a, b) => b.revenue - a.revenue);
      return temp.slice(0, 4);
    },

    newProducts() {
      const temp = this.products.slice().reverse();
      return temp.slice(0, 5);
    },
    activeProduct() {
      if (this.activeIndex < 0) return null;
      return this.filteredProduct[this.convertToOriginalIndex()];
    },

    getId() {
      return this.id;
    },
    sortedProduct() {
      return this.filteredProduct.slice().reverse();
    },
  },
  methods: {
    createProduct(data) {
      try {
        bookstoreService.createProduct(this.product);
        Swal.fire({
          title: "Thêm sách thành công!",
          text: "Bạn đã thêm một sách mới vào cửa hàng",
          icon: "success",
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.refreshList();
            this.resetProduct();
            console.log(this.product);
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    resetProduct() {
      this.product.name = "";
      this.product.price = "";
      this.product.img = null;
      this.product.author = "";
      this.product.describe = "";
    },
    async retrieveProducts() {
      try {
        this.products = await bookstoreService.getAllProduct();
      } catch (error) {
        console.log(error);
      }
    },
    async retriveUser() {
      try {
        this.user = await bookstoreService.get(this.id);
      } catch (error) {
        console.log(error);
        this.$router.push({
          name: "notfound",
          params: {
            pathMatch: this.$route.path.split("/").slice(1),
          },
          query: this.$route.query,
          hash: this.$route.hash,
        });
      }
    },
    getUserId() {
      this.userId = this.id;
    },
    checkAdmins() {
      if (this.user.admin == true) {
        this.checkAdmin = true;
      } else {
        this.checkAdmin = false;
      }
    },

    closeDetailProduct() {
      this.activeIndex = -1;
    },
    async refreshList() {
      this.searchText = "";
      await this.retriveUser();
      this.retrieveProducts();
      this.activeIndex = -1;
      this.getUserId();
      this.checkAdmins();
    },
    openCart() {
      const cartIcon = this.$refs.cartIcon;
      const tooltipInstance = Tooltip.getInstance(cartIcon);

      // Tắt tooltip ngay lập tức
      tooltipInstance.hide();
      this.$router.push({
        name: "cart",
        params: {
          id: this.userId,
        },
      });
    },
    increaseToTalKey() {
      this.totalCountKey++;
    },
    handleProductIdSelected(selectedProducts) {
      this.productSelected = selectedProducts;
    },
    async deleteSelectedProducts() {
      if (this.productSelected.length == 0) {
        Swal.fire({
          title: "Không có sản phẩm nào được chọn để xóa",
          icon: "info",
        });
        return;
      }
      try {
        const swalResult = await Swal.fire({
          title:
            "Bán có muốn xóa " + this.productSelected.length + " sản phẩm?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Có",
          cancelButtonText: "Hủy",
        });
        if (swalResult.isConfirmed) {
          await Promise.all(
            this.productSelected.map(async (id) => {
              await bookstoreService.deleteProduct(id);
              await bookstoreService.deleteCartbyProductId(id);
            })
          );
          location.reload();
        }
      } catch (error) {
        console.log(error);
      }
    },
    sortItem(value) {
      this.$refs.productList.sortProducts(value);
    },

    manager() {
      const managerIcon = this.$refs.managerIcon;
      const tooltipInstance = Tooltip.getInstance(managerIcon);
      tooltipInstance.hide();
      this.$router.push({
        name: "manager",
        query: { userID: this.id },
      });
    },
    change() {
      if (this.isEdit) {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }
    },
    unchange() {
      this.isEdit = false;
    },
    async updateUser() {
      console.log(this.user);
      await bookstoreService.updateUser(this.id, this.user);
      alert("Chỉnh sửa thông tin thành công");
    },

    doEdit() {
      this.$router.push({
        name: "editor",
        params: { productId: this.products[this.activeIndex]._id },
      });
    },
    changeProductClick(value) {
      this.productClick = value;
    },
    convertToOriginalIndex() {
      if (this.activeIndex === undefined || this.activeIndex === null) {
        return -1;
      }
      if (this.productClick == "topProduct") {
        const productIdInTopProducts = this.topProducts[this.activeIndex]._id;
        return this.products.findIndex(
          (product) => product._id === productIdInTopProducts
        );
      }
      if (this.productClick == "") {
        const productIdInTopProducts = this.sortedProduct[this.activeIndex]._id;
        return this.products.findIndex(
          (product) => product._id === productIdInTopProducts
        );
      }
      return this.activeIndex;
    },
  },
  mounted() {
    this.refreshList();
    new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']",
    });
  },
};
</script>
