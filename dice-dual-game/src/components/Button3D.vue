<template>
  <button class="pushable" :disabled="props.disabled">
  <span class="shadow"></span>
  <span class="edge" :style="{background:props.edge}"></span>
  <span class="front" :style="{background:props.background,padding:`${props.height}px ${props.width}px`,'font-size':props.fontSize}">
    <slot></slot>
  </span>
</button>
</template>
<script lang="ts" setup>
import {defineProps} from 'vue'
const props = defineProps({
  background:{type:String,required:false,default:' hsl(0, 0%, 96%)'},
  edge:{type:String,required:false,default:'hsl(0, 0%, 35%)'},
  width:{type:String,required:false,default:'42'},
  height:{type:String,required:false,default:'12'},
  disabled:{type:Boolean,required:false,default:false},
  fontSize:{type:String,required:false,default:'16px'},
})
</script>
<style scoped lang="scss">
.pushable {
  position: relative;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}
.shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: hsl(0deg 0% 0% / 0.25);
  transform: translateY(3px);
}
.edge {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
}
.front {
  display: block;
  position: relative;
  // padding: 12px 42px;
  border-radius: 12px;
  // font-size: 1.25rem;
  // color: white;
  // background: hsl(0, 0%, 81%);
  transform: translateY(-4px);

  // transform: translateY(-4px);
}

.pushable:disabled .front {
  background: hsl(0, 0%, 83%) !important;
  transform: translateY(-3px);
}
.pushable:hover:disabled {
  cursor: not-allowed;
}
.pushable:disabled .shadow {
  background: hsl(0deg 0% 0% / 0.25) !important;
  transform: translateY(1px);
}
.pushable:disabled .edge {
  background: hsl(0, 0%, 35%) !important;

  background: hsl(0deg 0% 0% / 0.25) !important;
  transform: translateY(1px);
}
.pushable:hover:not(:disabled) .front {
  transform: translateY(-6px);
}
.pushable:hover:not(:disabled) .shadow {
  transform: translateY(4px);
}
.pushable:active:not(:disabled) .front {
  transform: translateY(-2px);
}
.pushable:active:not(:disabled) .shadow {
  transform: translateY(1px);
}

.pushable:focus:not(:focus-visible) {
  outline: none;
}</style>