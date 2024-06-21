#include <stdlib.h>
#include <emscripten.h>
// #include <stdio.h>
// #include <time.h>
#include <stdbool.h>
#include <string.h>
#include <math.h>

int count = 0;

extern unsigned int curTime();
extern void logNum(int *arr, int to, int from, bool ex);
extern void logGet(int *arr, int i);
extern void logCom(int *arr, int i, int j);
extern void logSet(int *arr, int i);
extern void logSwap(int *arr, int i, int j);
extern void highlights(int i, int j);
/**
 * 0 - get
 * 1 - set
 * 2 - compare
 * 3 - swap
 * 4 - auxGet
 * 5 - auxSet
 * 6 - auxCompare
 * 7 - auxSwap
 */
extern void incStat(int stat, int n);

void printArr(int *arr, int to, int from, bool ex)
{
    logNum(arr, to, from, ex);
}

int getNum(int *arr, int i)
{
    logGet(arr, i);
    return arr[i];
}

int compareNums(int *arr, int i, int j)
{
    logCom(arr, i, j);
    return arr[i] - arr[j];
}

void setNum(int *arr, int i, int v)
{
    logSet(arr, i);
    arr[i] = v;
}

int min(int x, int y)
{
    if (y < x)
        return y;
    return x;
}
int max(int x, int y)
{
    if (y > x)
        return y;
    return x;
}

void swap(int *arr, int i, int j, bool dontPrint)
{
    logSwap(arr, i, j);
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    if (!dontPrint)
        printArr(arr, min(i, j), max(i, j), true);
    // printArr(arr, n, min(i, j), max(i, j), true);
}

EMSCRIPTEN_KEEPALIVE
void shuffle(int *arr, int n)
{
    srand(curTime());
    int cur = n;
    while (cur > 0)
        swap(arr, cur--, rand() % n, false);
}

EMSCRIPTEN_KEEPALIVE
void shuffle2(int *arr, int n)
{
    srand(curTime());
    for (int i = 0; i < n - 1; i++)
        swap(arr, i, rand() % (n - i) + i, false);
}

EMSCRIPTEN_KEEPALIVE
void bogo(int *arr, int n)
{
    bool sort = true;
    while (sort)
    {
        shuffle(arr, n);
        printArr(arr, 0, n, false);
        sort = false;
        for (int i = 0; i < n - 1; i++)
            if (compareNums(arr, i, i + 1) > 0)
            {
                sort = true;
                break;
            }
    }
}

EMSCRIPTEN_KEEPALIVE
void selection(int *arr, int n)
{
    for (int i = 0; i < n - 1; i++)
    {
        int min = i;
        for (int j = i + 1; j < n; j++)
            if (compareNums(arr, j, min) < 0)
                min = j;
        if (min != i)
            swap(arr, min, i, false);
    }
}

EMSCRIPTEN_KEEPALIVE
void insertion(int *arr, int n)
{
    for (int i = 1; i < n; i++)
        for (int j = i; j > 0 && compareNums(arr, j - 1, j) > 0; j--)
            swap(arr, j - 1, j, false);
}

int partition(int *arr, int min, int max, int n)
{
    int pivot = getNum(arr, max);
    int ind = min - 1;
    for (int i = min; i < max; i++)
    {
        incStat(2, 1);
        if (getNum(arr, i) < pivot && ++ind != i)
            swap(arr, ind, i, false);
    }
    swap(arr, ++ind, max, false);
    return ind;
}

EMSCRIPTEN_KEEPALIVE
void quick(int *arr, int min, int max, int n)
{
    if (min >= max || min < 0)
        return;
    int pivot = partition(arr, min, max, n);
    quick(arr, min, pivot - 1, n);
    quick(arr, pivot + 1, max, n);
}

EMSCRIPTEN_KEEPALIVE
void heap(int *arr, int n)
{
    int start = n / 2;
    int end = n;
    while (end > 1)
    {
        if (start > 0)
            start--;
        else
        {
            end--;
            swap(arr, end, 0, false);
        }
        int root = start;
        while (root * 2 + 1 < end)
        {
            int child = root * 2 + 1;
            if (child + 1 < end && compareNums(arr, child, child + 1) < 0)
                child++;
            if (compareNums(arr, root, child) >= 0)
                break;
            swap(arr, root, child, false);
            root = child;
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void bubble(int *arr, int n)
{
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            if (compareNums(arr, j, j + 1) > 0)
                swap(arr, j, j + 1, false);
}

EMSCRIPTEN_KEEPALIVE
void optimizedbubble(int *arr, int n)
{
    bool swapped;
    for (int i = 0; i < n; i++)
    {
        swapped = false;
        for (int j = 0; j < n - i - 1; j++)
            if (compareNums(arr, j, j + 1) > 0)
            {
                swap(arr, j, j + 1, false);
                swapped = true;
            }
        if (!swapped)
            break;
    }
}

int getMax(int *arr, int n)
{
    int mx = arr[0];
    for (int i = 1; i < n; i++)
        if (arr[i] > mx)
            mx = arr[i];
    return mx;
}

// O(n + log_b(n)*(3n + b))
EMSCRIPTEN_KEEPALIVE
void radixsort(int *arr, int n, int base)
{
    int m = n - 1;
    for (int exp = 1; m / exp > 0; exp *= base)
    {
        int output[n];
        int i, x, count[base];
        for (int i = 0; i < base; i++)
            count[i] = 0;

        for (i = 0; i < n; i++)
        {
            count[(getNum(arr, i) / exp) % base]++;
            incStat(5, 1);
        }

        for (i = 1; i < base; i++)
        {
            count[i] += count[i - 1];
            incStat(4, 1);
            incStat(5, 1);
        }

        for (i = n - 1; i >= 0; i--)
        {
            x = getNum(arr, i);
            output[count[(x / exp) % base] - 1] = x;
            count[(x / exp) % base]--;
            incStat(5, 2);
            incStat(4, 1);
        }

        for (i = 0; i < n; i++)
        {
            setNum(arr, i, output[i]);
            incStat(4, 1);
            printArr(arr, i, i, true);
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void merge(int *arr, int min, int max, int *array, int *changes, int depth, int size)
{
    if (max - min <= 1)
        return;
    int half = (min + max) / 2;
    merge(array, min, half, arr, changes, depth + 1, size);
    merge(array, half, max, arr, changes, depth + 1, size);
    int i = min, j = half;
    for (int k = min; k < max; k++)
    {
        int first = arr[i], second = arr[j];
        highlights(i, j);
        incStat(depth % 2 == 0 ? 0 : 4, 2);
        incStat(2, 2);
        if (i < half && (j >= max || first <= second))
        {
            array[k] = changes[k] = first;
            incStat(depth % 2 == 0 ? 1 : 5, 1);
            i++;
        }
        else
        {
            array[k] = changes[k] = second;
            incStat(depth % 2 == 0 ? 1 : 5, 1);
            j++;
        }
        // if (array[k] != cache) printArr(changes, k, k, true);
        // await new Promise(r => setTimeout(r, 0));
    }
    for (int k = min; k < max; k++)
        printArr(changes, k, k, true);

    // printArr(changes, min, max, false);
    if (depth == 0)
        for (int i = 0; i < size; i++)
            arr[i] = array[i];
}

EMSCRIPTEN_KEEPALIVE
void shell(int *arr, int n)
{
    for (int h = n / 2; h > 0; h /= 2)
    {
        for (int i = h; i < n; ++i)
        {
            int temp = getNum(arr, i);
            int j;
            for (j = i; j >= h && getNum(arr, j - h) > temp; j -= h)
            {
                setNum(arr, j, getNum(arr, j - h));
                printArr(arr, j, j - h, true);
            }
            setNum(arr, j, temp);
            printArr(arr, j, j, true);
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void comb(int *arr, int n)
{
    int h = n;
    bool swapped = true;
    while (h != 1 || swapped)
    {
        h = max((h * 10) / 13, 1);
        swapped = false;
        for (int i = 0; i < n - h; i++)
            if (compareNums(arr, i, i + h) > 0)
            {
                swap(arr, i, i + h, false);
                swapped = true;
            }
    }
}

EMSCRIPTEN_KEEPALIVE
void cycle(int *arr, int n)
{
    for (int h = 0; h <= n - 2; h++)
    {

        // initialize item as starting point
        int item = getNum(arr, h);

        // Find position where we put the item. We basically
        // count all smaller elements on right side of item.
        int pos = h;
        for (int i = h + 1; i < n; i++)
            if (compareNums(arr, i, h) < 0)
                pos++;

        // If item is already in correct position
        if (pos == h)
            continue;

        // ignore all duplicate elements
        while (item == getNum(arr, pos))
            pos += 1;

        // put the item to it's right position
        if (pos != h)
        {
            int temp = item;
            item = getNum(arr, pos);
            setNum(arr, pos, temp);
            printArr(arr, pos, h, true);
        }

        // Rotate rest of the cycle
        while (pos != h)
        {
            pos = h;

            // Find position where we put the element
            for (int i = h + 1; i < n; i++)
                if (getNum(arr, i) < item)
                    pos += 1;

            // ignore all duplicate elements
            while (item == getNum(arr, pos))
                pos += 1;

            // put the item to it's right position
            if (item != getNum(arr, pos))
            {
                int temp = item;
                item = getNum(arr, pos);
                setNum(arr, pos, temp);
                printArr(arr, pos, h, true);
            }
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void coctail(int *arr, int n)
{
    bool swapped = true;
    int start = 0;
    int end = n;

    while (swapped)
    {
        swapped = false;
        for (int i = start; i < end - 1; ++i)
            if (compareNums(arr, i, i + 1) > 0)
            {
                swap(arr, i, i + 1, false);
                swapped = true;
            }
        if (!swapped)
            break;
        swapped = false;
        --end;
        for (int i = end - 1; i >= start; --i)
            if (compareNums(arr, i, i + 1) > 0)
            {
                swap(arr, i, i + 1, false);
                swapped = true;
            }
        ++start;
    }
}

void bitonicMerge(int *arr, int l, int h, bool d)
{
    if (h <= 1)
        return;
    int k = h / 2;
    for (int i = l; i < l + k; i++)
        if (d == (compareNums(arr, i, i + k) > 0))
            swap(arr, i, i + k, false);
    bitonicMerge(arr, l, k, d);
    bitonicMerge(arr, l + k, k, d);
}

EMSCRIPTEN_KEEPALIVE
void bitonic(int *arr, int l, int h, bool d)
{
    if (h <= 1)
        return;
    int k = h / 2;
    bitonic(arr, l, k, true);
    bitonic(arr, l + k, k, false);
    bitonicMerge(arr, l, h, d);
}

EMSCRIPTEN_KEEPALIVE
void gnome(int *arr, int n)
{
    int i = 0;
    while (i < n)
    {
        if (i == 0)
            ++i;
        if (compareNums(arr, i, i - 1) >= 0)
            ++i;
        else
        {
            swap(arr, i, i - 1, false);
            --i;
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void stooge(int *arr, int l, int h)
{
    if (l >= h)
        return;
    if (compareNums(arr, l, h) > 0)
        swap(arr, l, h, false);

    if (h <= l + 1)
        return;

    int t = (h - l + 1) / 3;
    stooge(arr, l, h - t);
    stooge(arr, l + t, h);
    stooge(arr, l, h - t);
}

EMSCRIPTEN_KEEPALIVE
void oddEven(int *arr, int n)
{
    bool sort = true;
    while (sort)
    {
        sort = false;
        for (int i = 1; i < n - 1; i += 2)
            if (compareNums(arr, i, i + 1) > 0)
            {
                swap(arr, i, i + 1, false);
                sort = true;
            }
        for (int i = 0; i < n - 1; i += 2)
            if (compareNums(arr, i, i + 1) > 0)
            {
                swap(arr, i, i + 1, false);
                sort = true;
            }
    }
}

void partition3(int *arr, int l, int r, int *i, int *j)
{
    *i = l - 1, *j = r;
    int p = l - 1, q = r;
    int v = getNum(arr, r);

    while (true)
    {
        while (getNum(arr, ++*i) < v)
        {
        };
        while (v < getNum(arr, --*j))
            if (*j == l)
                break;

        if (*i >= *j)
            break;

        swap(arr, *i, *j, false);

        if (getNum(arr, *i) == v)
        {
            p++;
            swap(arr, p, *i, false);
        }

        if (getNum(arr, *j) == v)
        {
            q--;
            swap(arr, *j, q, false);
        }
    }
    swap(arr, *i, r, false);
    *j = *i - 1;
    for (int k = l; k < p; ++k, --*j)
        swap(arr, k, *j, false);

    ++*i;
    for (int k = r - 1; k > q; --k, ++i)
        swap(arr, *i, k, false);
}

EMSCRIPTEN_KEEPALIVE
void quick3(int *arr, int l, int r)
{
    if (r <= l)
        return;

    int i, j;

    partition3(arr, l, r, &i, &j);

    quick3(arr, l, j);
    quick3(arr, i, r);
}

void timsertion(int *arr, int l, int r)
{
    for (int i = l + 1; i <= r; i++)
    {
        int temp = getNum(arr, i);
        int j;
        for (j = i - 1; j >= l && getNum(arr, j) > temp; --j)
        {
            setNum(arr, j + 1, getNum(arr, j));
            printArr(arr, j + 1, j, true);
        }
        setNum(arr, j + 1, temp);
        printArr(arr, j + 1, j + 1, true);
    }
}

void timerge(int *arr, int l, int m, int r)
{
    int len1 = m - l + 1, len2 = r - m;
    int left[len1], right[len2];

    for (int i = 0; i < len1; ++i)
        left[i] = arr[l + i];
    for (int i = 0; i < len2; ++i)
        right[i] = arr[m + 1 + i];
    incStat(5, len1 + len2);
    incStat(0, len1 + len2);

    int i = 0, j = 0, k = l;

    for (k = l; k <= r; k++)
    {
        int first = left[i], second = right[j];
        incStat(4, 2);
        highlights(i + l, m + 1 + j);
        if (i < len1 && (j >= len2 || first < second))
        {
            setNum(arr, k, first);
            i++;
        }
        else
        {
            setNum(arr, k, second);
            j++;
        }
    }
    for (int i = l; i < r; i++)
        printArr(arr, i, i, true);
}

EMSCRIPTEN_KEEPALIVE
void timSort(int *arr, int n, int RUN)
{
    for (int i = 0; i < n; i += RUN)
        timsertion(arr, i, min(i + 32 - 1, n - 1));
    for (int size = RUN; size < n; size *= 2)
    {
        for (int left = 0; left < n; left += size * 2)
        {
            int mid = left + size - 1;
            int right = min(left + 2 * size - 1, n - 1);
            if (mid < right)
                timerge(arr, left, mid, right);
        }
    }
    printArr(arr, 0, n, false);
}

EMSCRIPTEN_KEEPALIVE
void stableQuick(int *arr, int s, int n)
{
    if (n <= 1)
        return;

    int mid = n - 1;
    int pivot = getNum(arr, s + mid);

    int *smaller = malloc(sizeof(int) * n);
    int *greater = malloc(sizeof(int) * n);
    int j = 0, k = 0;
    for (int i = 0; i < n; i++)
    {
        int val = getNum(arr, s + i);
        if (i != mid)
        {
            if (val < pivot)
                smaller[j++] = val;
            else if (val > pivot)
                greater[k++] = val;
            else if (i < mid)
                smaller[j++] = val;
            else
                greater[k++] = val;
        }
        incStat(5, 1);
    }
    int l = s - 1;
    for (int i = 0; i < j; i++)
    {
        setNum(arr, ++l, smaller[i]);
        incStat(4, 1);
        printArr(arr, l, l, true);
    }
    setNum(arr, ++l, pivot);
    printArr(arr, l, l, true);
    for (int i = 0; i < k; i++)
    {
        setNum(arr, ++l, greater[i]);
        incStat(4, 1);
        printArr(arr, l, l, true);
    }
    free(smaller);
    free(greater);
    stableQuick(arr, s, j);
    stableQuick(arr, s + j + 1, k);
}

EMSCRIPTEN_KEEPALIVE
void reverse(int *arr, int n)
{
    int m = n / 2;
    for (int i = 0; i < m; i++)
        swap(arr, i, n - 1 - i, false);
}

EMSCRIPTEN_KEEPALIVE
void almostSorted(int *arr, int n)
{
    int m = n / 20;
    for (int i = 0; i < m; i++)
        swap(arr, rand() % n, rand() % n, false);
}

EMSCRIPTEN_KEEPALIVE
void manySimilar(int *arr, int n)
{
    int ind = -1;
    for (int i = 1; i <= 10; i++)
        for (int j = 0; j < n / 10 && ind < n; j++)
        {
            setNum(arr, ++ind, i * n / 10);
            printArr(arr, ind, ind, true);
        }
}

EMSCRIPTEN_KEEPALIVE
void scrambledTail(int *arr, int n)
{
    for (int s = 0; s < n / 10; s++)
        for (int j = rand() % (n - s); j < n - s - 1; j++)
            swap(arr, j, j + 1, false);
}

EMSCRIPTEN_KEEPALIVE
void finalMerge(int *arr, int n)
{
    int m = n / 2;
    for (int i = 0; i < m; i++)
    {
        setNum(arr, i, i * 2);
        setNum(arr, i + m, i * 2 + 1);
        printArr(arr, i, i + m, true);
    }
}

EMSCRIPTEN_KEEPALIVE
void sawtooth(int *arr, int n)
{
    int m = n / 4;
    for (int i = 0; i < n; i++)
    {
        setNum(arr, i, i % m * 4);
        printArr(arr, i, i, true);
    }
}

EMSCRIPTEN_KEEPALIVE
void pipeOrgan(int *arr, int n)
{
    for (int i = 0; i < n / 2; i++)
    {
        setNum(arr, i, i * 2);
        setNum(arr, n - i - 1, i * 2);
        printArr(arr, i, n - i - 1, true);
    }
}

EMSCRIPTEN_KEEPALIVE
void finalRadix(int *arr, int n)
{
    for (int i = 0; i < n; i++)
    {
        if (i % 2 == 0)
            setNum(arr, i, i / 2);
        else
            setNum(arr, i, (i + n) / 2);
        printArr(arr, i, i, true);
    }
}

/**
 * iLeftChild(i)  = 2⋅i + 1
   iRightChild(i) = 2⋅i + 2
   iParent(i)     = floor((i−1) / 2)

*/
EMSCRIPTEN_KEEPALIVE
void heapify(int *arr, int n)
{
    int start = (n - 1) / 2 + 1;
    while (start > 0)
    {
        --start;
        while (2 * start + 1)
        {
            int child = 2 * start + 1;
            if (child + 1 < n && compareNums(arr, child, child + 1) < 0)
                ++child;
            if (compareNums(arr, start, child) < 0)
            {
                swap(arr, start, child, false);
                start = child;
            }
            else
                break;
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void sineCurve(int *arr, int n)
{
    for (int i = 0; i < n / 2; ++i)
    {
        int v = pow(sin(i * 3.14159265358979323846 / n), 2) * n;
        setNum(arr, i, v);
        setNum(arr, n - i - 1, v);
        printArr(arr, i, n - i - 1, true);
    }
}