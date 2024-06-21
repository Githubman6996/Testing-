export const sorts = {
    stooge: {
        cat: "Slow",
        name: "Stooge",
        max: 128
    },
    gnome: {
        cat: "Slow",
        name: "Gnome",
        max: 512
    },
    cycle: {
        cat: "Slow",
        name: "Cycle",
        max: 512
    },
    // Common
    insertion: {
        cat: "Common",
        name: "Insertion",
        max: 1024
    },
    selection: {
        cat: "Common",
        name: "Selection",
        max: 1024
    },
    bubble: {
        cat: "Common",
        name: "Bubble",
        max: 512
    },
    heap: {
        cat: "Common",
        name: "Heap",
        max: 8192
    },
    // Quick
    quick: {
        cat: "Quick",
        name: "Quick",
        max: 16384
    },
    stableQuick: {
        cat: "Quick",
        name: "Stable Quick",
        max: 2048
    },
    quick3: {
        cat: "Quick",
        name: "3 Way Quick",
        max: 16384
    },
    // Merge
    bitonic: {
        cat: "Merge",
        name: "Bitonic Merge",
        max: 8192
    },
    merge: {
        cat: "Merge",
        name: "Merge",
        max: 16384
    },
    timSort: {
        cat: "Merge",
        name: "Tim",
        max: 8192
    },
    // Radix
    radix2: {
        cat: "Radix",
        name: "Base 2 Radix",
        max: 8192
    },
    radix4: {
        cat: "Radix",
        name: "Base 4 Radix",
        max: 8192
    },
    radix10: {
        cat: "Radix",
        name: "Base 10 Radix",
        max: 8192
    },
    // Extra
    optimizedBubble: {
        cat: "Extra",
        name: "Optimized Bubble",
        max: 512
    },
    oddEven: {
        cat: "Extra",
        name: "Odd/Even",
        max: 1024
    },
    cocktail: {
        cat: "Extra",
        name: "Cocktail Shaker",
        max: 512
    },
    shell: {
        cat: "Extra",
        name: "Shell",
        max: 4096
    },
    comb: {
        cat: "Extra",
        name: "Comb",
        max: 4096
    },
}

/**
 * 
    <option selected value="shuffle">Shuffle</option>
    <option value="reverse">Reverse</option>
    <option value="almostSorted">Almost Sorted</option>
    <option value="manySimilar">Many Similar</option>
    <option value="scrambledTail">Scrambled Tail</option>
    <option value="finalMerge">Final Merge</option>
    <option value="sawtooth">Sawtooth</option>
    <option value="pipeOrgan">Pipe Organ</option>
    <option value="finalRadix">Final Radix</option>
    <option value="heapify">Heapify</option>
    <option value="sineCurve">Sine Curve</option>
 */

export const shuffles = {
    shuffle: {
        name: "Shuffled Input"
    },
    reverse: {
        name: "Reversed Input"
    },
    almostSorted: {
        name: "Almost Sorted"
    },
    manySimilar: {
        name: "Many Similar"
    },
    scrambledTail: {
        name: "Scrambled Tail"
    },
    finalMerge: {
        name: "Final Merge"
    },
    sawtooth: {
        name: "Sawtooth Input"
    },
    pipeOrgan: {
        name: "Pipe Organ"
    },
    finalRadix: {
        name: "Final Radix Pass"
    },
    heapify: {
        name: "Heapified Input"
    },
    sineCurve: {
        name: "Sine Wave Curve"
    }
}