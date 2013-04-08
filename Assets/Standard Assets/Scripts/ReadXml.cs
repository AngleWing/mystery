using UnityEngine;  
using System.Xml;  
using System.Collections; 
using System.Xml.Serialization; 
using System.IO; 
using System.Text; 



public class ReadXml : MonoBehaviour {
	
	
public string[] personName=new string[10];
public string[] message1=new string[10];
public string[] message2=new string[10]; 
Rect windowRect = new Rect(10, Screen.height-160, 200, 150);
public	GUIStyle style;
public	GUIStyle styleB;
public	GUIStyle styleLab1;
public	GUIStyle styleLab2;
public GUISkin mySkin;	
bool windowOpen=false;
int talkID = 0;
int num1;
int num2;	
public int a=0;
public int b=0;	
public int c=0;	
XmlNode root;
    void Start () {
        print(Application.dataPath);
        string url = Application.dataPath + "/GUI/talks.xml";

        XmlDocument xmldoc = new XmlDocument();


        xmldoc.Load(url);

         //读取方式
        root = xmldoc.SelectSingleNode("/talks");
       //读取对话
		if (talkID != 0)
			talk();
	}
	
	void talk(){
               
            XmlNodeList nodelist = root.ChildNodes;
            foreach (XmlNode node in nodelist)
            {
                XmlElement xmlelement = (XmlElement)node;
                if (xmlelement.GetAttribute("talkID") == talkID.ToString())
                {
				XmlNodeList person=xmlelement.ChildNodes;	
	            XmlNode person1=xmlelement.ChildNodes[0];
				XmlNode person2=xmlelement.ChildNodes[1];
				XmlNodeList msg1=person1.ChildNodes;
				XmlNodeList msg2=person2.ChildNodes;
				XmlElement xmlelement2=(XmlElement)person2;
				XmlElement xmlelement1=(XmlElement)person1;
				   int n=msg1.Count;
					int m=msg2.Count;
				  num1=n;
				num2=m;
				
					
					for(int i=0;i<n;i++){
					string message=xmlelement1.ChildNodes.Item(i).InnerText;
					message1[i]=message;
					}				
				
				  
					for(int j=0;j<m;j++){
					string message=xmlelement2.ChildNodes.Item(j).InnerText;
					message2[j]=message;
					}				
				
			
					
			
                 personName[0]=person1.Attributes["name"].InnerText;
				personName[1]=person2.Attributes["name"].InnerText;
                
				
                    break;
                }
            }

        }

   void OnWindowDraw(int windowID){ 
   if(GUI.Button(new Rect(90,120,41,22),"  OK",styleB)){
			
			if(a==0){
				b=b+1;
			
			}
			if(a==1){
				c=c+1;
				
			}
			a=a+1;
			if(a==2)a=0;
		   if(c==num2&&b==num1){
				windowOpen=false;
		}
		}
		if(a==0){
		 GUI.Label(new Rect(10,10,10,10),personName[a],styleLab1);
		GUI.Label(new Rect(10,30,160,100),message1[b],styleLab2);
			
		}else{
			GUI.Label(new Rect(10,10,10,10),personName[a],styleLab1);
		GUI.Label(new Rect(10,30,160,100),message2[c],styleLab2);
		
		}
		
  		GUI.DragWindow();
    }
	
	void OnGUI(){
		GUI.skin=mySkin;
		if(windowOpen){
   			windowRect = GUI.Window(0,windowRect,OnWindowDraw,"",style);
			
    	}
	}
	
	void SetWindowOpen(bool open){
		windowOpen = open;
	}
	
	bool WindowOpen() {
		return windowOpen;
	}
	
	void SetTalkID(int talk)
	{
		talkID = talk;
		this.talk();
	}

}
