<script>
export default {
  props: {
    modelvalue: { type: String, default: "" },
  },
  emits: ["submit", "update:modelValue"],
  methods: {
    updateModelValue(e) {
      this.$emit("update:modelValue", e);
    },
    submit() {
      this.updateModelValue(this.$refs.inputRef.value); //Lấy value trong input field thông qua inputRef
      this.$emit("submit");
    },
  },
};
</script>

<template>
  <div class="input-group">
    <input
      type="text"
      class="form-control"
      placeholder="Nhập thông tin cần tìm"
      :value="modelvalue"
      id="TestCode"
      @keyup.enter="submit"
      ref="inputRef"
    />
    <!--ref = "inputRef" lấy dữ liệu trong input field -->
    <div class="input-group-append">
      <button class="btn btn-secondary" type="button" @click="submit">
        <i class="fa-solid fa-magnifying-glass"></i>Tìm Kiếm
      </button>
    </div>
  </div>
</template>

<style>
.input-group {
  width: 500px;
  position: relative;
  margin-bottom: 20px;
  margin-left: 35px;
}
</style>
