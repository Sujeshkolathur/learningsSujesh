package theory;

import java.util.ArrayList;
import java.util.List;

public class Abstraction {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		List<Integer> list = new ArrayList<>();
		list.add(null);//hides the implementation of add method
		
		ArrayList<Integer> list2 =  new ArrayList<>();
		list2.add(null);

	}

}
