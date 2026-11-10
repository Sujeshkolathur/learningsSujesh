package interview.dyanamic;

import java.util.HashMap;
import java.util.Map;

public class LRUCacheMain {

	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}

class LRUCache{
	class Node{
		int key;
		int value;
		Node next;
		Node prev;
		Node(int key, int value){
			this.value=value;
			this.key=key;
		}
	}
	int capacity;
	Map<Integer, Node> items=new HashMap<>();
	Node head=new Node(0, 0);
	Node tail= new Node(0, 0);
	LRUCache(int capacity){
		this.capacity=capacity;
		head.next=tail;
		tail.prev=head;
	}
	public Node removeNode(Node node) {
			node.prev.next=node.next;
			node.next.prev=node.prev;
			return node;
	}
	
	public void insertAtHead(Node newNode){
		newNode.next=head.next;
		newNode.prev=head;
		head.next.prev=newNode;
		head.next=newNode;		
	}
	public int get(int key) {
		if(!items.containsKey(key)) return -1;
		Node node= items.get(key);
		removeNode(node);
		insertAtHead(node);
		return node.value;
		
	}
	public void put(int key,int value) {
		Node node = items.get(key);
		node.value=value;
		if(items.containsKey(key)) {
			removeNode(items.get(key));
			
		}else {
			if(items.size()==capacity) {
				Node lru = tail.prev;
				removeNode(lru);
				items.remove(lru.key);
				
			}
		}
		insertAtHead(node);
		items.put(key, node);
	
		
	}
	
}