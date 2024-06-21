#include <emscripten.h>
#include <stdlib.h>
#include <stdbool.h>

extern unsigned int seed();

EMSCRIPTEN_KEEPALIVE
void shuffle(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void shuffle2(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void bogo(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void selection(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void insertion(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void quick(int *arr, int min, int max, int n);
EMSCRIPTEN_KEEPALIVE
void heap(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void bubble(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void optimizedbubble(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void radixsort(int *arr, int n, int base);
EMSCRIPTEN_KEEPALIVE
void merge(int *arr, int min, int max, int *array, int *changes, int depth, int size);
EMSCRIPTEN_KEEPALIVE
void shell(int* arr, int n);
EMSCRIPTEN_KEEPALIVE
void comb(int* arr, int n);
EMSCRIPTEN_KEEPALIVE
void cycle(int* arr, int n);
EMSCRIPTEN_KEEPALIVE
void coctail(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void bitonic(int *arr, int l, int h, bool d);
EMSCRIPTEN_KEEPALIVE
void gnome(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void stooge(int *arr, int l, int h);
EMSCRIPTEN_KEEPALIVE
void oddEven(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void quick3(int *arr, int l, int r);
EMSCRIPTEN_KEEPALIVE
void timSort(int *arr, int n, int RUN);
EMSCRIPTEN_KEEPALIVE
void stableQuick(int* arr, int s, int n);
EMSCRIPTEN_KEEPALIVE
void reverse(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void almostSorted(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void manySimilar(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void scrambledTail(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void finalMerge(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void sawtooth(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void pipeOrgan(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void finalRadix(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void heapify(int *arr, int n);
EMSCRIPTEN_KEEPALIVE
void sineCurve(int *arr, int n);

// EMSCRIPTEN_KEEPALIVE
int main() {
    srand(seed());
    // printf("%d\n", 0);
    return 0;
}

EMSCRIPTEN_KEEPALIVE
void *wasmmalloc(size_t n) {
    return malloc(n);
}

EMSCRIPTEN_KEEPALIVE
void wasmfree(void *ptr) {
    free(ptr);
}