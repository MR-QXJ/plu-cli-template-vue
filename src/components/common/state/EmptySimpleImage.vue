//
空状态（自定义组件状态保持和antd其他组件空状态图片一致）（函数式组件/无状态组件）
<template functional>
  <section class="h100 w100 empty-simple-image">
    <section class="h100 w100 image">
      <svg
        width="64"
        height="41"
        viewBox="0 0 64 41"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(0 1)" fill="none" fillRule="evenodd">
          <ellipse fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7"></ellipse>
          <g fillRule="nonzero" stroke="#D9D9D9">
            <path
              d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"
            ></path>
            <path
              d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
              fill="#FAFAFA"
            ></path>
          </g>
        </g>
      </svg>
    </section>
    <p class="description" v-cloak>{{ props.desc }}</p>
  </section>
</template>

<script>
export default {
  props: ["desc"]
};
</script>

<style lang="scss" scoped>
.empty-simple-image {
  padding: 30px 0;
  color: rgba(0, 0, 0, 0.25);
  font-size: 14px;
  line-height: 22px;
  text-align: center;

  .image {
    height: 40px;
    margin-bottom: 8px;
  }
  .description {
    display: block;
    margin: 0;
  }
}
</style>
