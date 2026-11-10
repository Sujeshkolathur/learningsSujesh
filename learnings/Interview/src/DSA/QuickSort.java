package DSA;

import java.util.Stack;

public class QuickSort {

	public static void quickSort(int[] arr) {
		int low = 0, high = arr.length - 1;

		Stack<int[]> stack = new Stack<>();
		stack.push(new int[] { low, high });

		while (!stack.isEmpty()) {
			int[] range = stack.pop();
			int l = range[0], h = range[1];

			if (l < h) {
				int pivotIndex = partition(arr, l, h);

				// Push right and left subarray boundaries to stack
				stack.push(new int[] { l, pivotIndex - 1 });
				stack.push(new int[] { pivotIndex + 1, h });
			}
		}
	}

	private static int partition(int[] arr, int low, int high) {
		int pivot = arr[high];
		int i = low - 1;

		for (int j = low; j < high; j++) {
			if (arr[j] < pivot) {
				i++;
				swap(arr, i, j);
			}
		}

		swap(arr, i + 1, high);
		return i + 1;
	}

	private static void swap(int[] arr, int i, int j) {
		if (i != j) {
			int temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
		}
	}

	public static void main(String[] args) {
		int[] arr = { 10, 80, 30, 90, 40, 50, 70 };
		quickSort(arr);
		System.out.print("Sorted array: ");
		for (int val : arr) {
			System.out.print(val + " ");
		}
	}
}
