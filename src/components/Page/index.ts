import { withInstall } from '/@/utils';

import pageFooter from './src/PageFooter.vue';
import pageWrapper from './src/PageWrapper.vue';

export const PageFooter = withInstall(pageFooter);
//【issues/411】ReferenceError: Cannot access 'pageWrapper' before initialization
export const PageWrapper = setTimeout(()=>withInstall(pageWrapper));

export const PageWrapperFixedHeightKey = 'PageWrapperFixedHeight';
