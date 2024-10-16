<script lang="ts" setup>
import type { CSSProperties } from 'vue';

const props = withDefaults(
  defineProps<{
    value?: string | number;
    max?: number;
    min?: number;
    placeholder?: string;
    type?: 'text' | 'password' | 'number';
    minHeight?: string;
    style?: CSSProperties;
    radius?: string;
    onlyRead?: boolean;
    cleanable?: boolean;
    precision?: number; // only type = number available
  }>(),
  {
    cleanable: true,
  },
);

const showPassword = ref(false);

const emit = defineEmits<{
  (e: 'change', value?: string | number): void;
  (e: 'update:value', value?: string | number): void;
  (e: 'enter'): void;
  (e: 'clean'): void;
}>();
const textValue = ref<string | number | undefined>();

const inputValue = computed({
  set: (val: string | number | undefined) => {
    textValue.value = val;
    emit('update:value', val ?? undefined);
  },
  get: () => props.value ?? textValue.value,
});

const inputType = computed(() => {
  if (props.type === 'password') {
    if (showPassword.value) {
      return 'text';
    }
    else {
      return 'password';
    }
  }
  return props.type ?? 'text';
});

const onChange = (val: any) => {
  if (
    val !== ''
    && val !== undefined
    && props.type === 'number'
    && props.min !== undefined
    && Number(val) < props.min
  ) {
    val = props.min.toString();
  }

  inputValue.value = val;
  emit('change', val ?? undefined);
};

const onInput = (payload: any) => {
  let val = payload.target.value;

  const reg = new RegExp(/^-?\d+(\.\d+)?$/i);

  if (props.type === 'number' && !reg.test(val)) {
    val = val.replace(/[^\d.]/g, '');
    payload.target.value = val;
  }

  // 输入至存在小数点时进入
  if (props.precision !== undefined && val.includes('.')) {
    if ((val.split('.')[1] ?? '').length > 0) {
      const s1 = val.split('.')[0];
      const s2 = val.split('.')[1];
      if (s2) {
        if (props.precision === 0) {
          val = s1;
        }
        else {
          val = `${s1}.${s2.substring(0, props.precision)}`;
        }
      }
      payload.target.value = val;
    }
    else if (props.precision === 0) {
      val = val.split('.')[0];
      payload.target.value = val;
    }
  }
  inputValue.value = val;
};

const onBlur = () => {
  if (props.type === 'number' && inputValue.value) {
    const val = inputValue.value;
    inputValue.value = val;
  }
};
// const onVisibility = () => {
//   showPassword.value = !showPassword.value
// }

const inputRef = ref();
const onEnter = (ev: KeyboardEvent) => {
  if (ev.key === 'Enter') {
    inputRef.value.blur();
    emit('enter');
  }
};
</script>

<template>
  <UInput
    ref="inputRef"
    :style="style"
    :type="inputType === 'number' ? 'text' : inputType"
    :model-value="inputValue"
    :maxlength="max"
    :placeholder="placeholder ?? 'Input'"
    :readonly="onlyRead"
    :min="min"
    :ui="{
      base: 'border-none !bg-transparent text-end',
      padding: {
        sm: 'p-2.5',
      },
      color: {
        white: {
          outline:
            'ring-0 dark:ring-0 focus:ring-0 dark:focus:ring-0 shadow-none dark:shadow-none hover:shadow-none dark:hover:shadow-none',
        },
      },
    }"
    @input="onInput"
    @change="onChange"
    @keypress="onEnter"
    @blur="onBlur"
  />
</template>
