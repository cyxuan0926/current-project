<template>
    <div class="m-chart-block">
        <div class="m-chart-block__top__border">
            <span class="border__left__down"></span>
            <span class="border__left__up"></span>
            <span class="border__c"></span>
            <span class="border__l"></span>
            <span class="border__r"></span>
            <span class="border__right__down"></span>
            <span class="border__right__up"></span>
        </div>
        <div class="m-chart-block-content">
            <slot name="content"></slot>
        </div>
        <div class="m-chart-block__bottom__border">
            <span class="border__left__down"></span>
            <span class="border__left__up"></span>
            <span class="border__c"></span>
            <span class="border__l"></span>
            <span class="border__r"></span>
            <span class="border__right__down"></span>
            <span class="border__right__up"></span>
        </div>
        <div class="m-chart-block-empty">
            <slot name="empty"></slot>
        </div>
    </div>
</template>


<style lang="scss" scoped>
    .m-chart {
        &-block {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            overflow: hidden;

            &-content {
                position: absolute;
                top: 22px;
                bottom: 22px;
                width: 100%;
                left: 0;
                overflow: hidden;
                border-left: 1px solid #366C9D;
                border-right: 1px solid #366C9D;
            }

            &-empty {
                position: absolute;
                bottom: 40%;
                width: 100%;
                left: 0;
                overflow: hidden;
                z-index: 9;
                text-align: center;
                color: #6CDFF5;
            }

            &__top__border {
                top: 0;

                .border__left,
                .border__right {
                &__up { 
                    bottom: 3px;
                }
                }
            }

            &__bottom__border {
                bottom: 0;

                .border__left,
                .border__right {
                &__up { 
                    top: 3px;
                }
                }
            }

            &__top__border,
            &__bottom__border {
                position: absolute;
                left: 0;
                width: 100%;
                height: 22px;
                overflow: hidden;

                .border__left,
                .border__right {
                &__down,
                &__up {
                    position: absolute;
                    width: 0;
                    height: 2px;
                    border: 10px solid transparent;
                    overflow: hidden;
                    box-sizing: content-box;
                }

                &__down {
                    bottom: 0;
                }
                }

                .border__left {
                &__down,
                &__up {
                    left: 0;
                    border-left-color: #6EE3FB
                }

                &__up { 
                    border-left-color: #000A26;
                }
                }

                .border__right {
                &__down,
                &__up {
                    right: 0;
                    border-right-color: #6EE3FB
                }

                &__up { 
                    border-right-color: #000A26;
                }
                }

                .border__c,
                .border__l,
                .border__r {
                position: absolute;
                bottom: 10px;
                overflow: hidden;
                }

                .border__c {
                left: 10px;
                right: 10px;
                height: 1px;
                background-color: #366C9D;
                }
                
                .border__l,
                .border__r {
                width: 30px;
                height: 2px;
                background-color: #6EE3FB;
                }

                .border__l {
                left: 10px;
                }

                .border__r {
                right: 10px;
                }
            }
            }
    }
</style>