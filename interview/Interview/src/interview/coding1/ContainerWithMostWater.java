package interview.coding1;

public class ContainerWithMostWater {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		int[] arr = {1,  8,  6,  2,  5,  4, 8,  3,  7};
		int left = 0;
		int right = arr.length-1;
		int maxArea=0;
		while (left<right){
			int height = Math.min(arr[left], arr[right]);
			int width = right-left;
			int area = height*width;
			maxArea=Math.max(maxArea,area);
			if(arr[left]<arr[right]) {
				left++;	
			}else {
				right--;
			}
			
		}
		System.out.println(maxArea);
	}

}
