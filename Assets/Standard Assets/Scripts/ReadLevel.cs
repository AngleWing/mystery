using UnityEngine;  
using System.Xml;  
using System.Collections; 
using System.Xml.Serialization; 
using System.IO; 
using System.Text; 
using System.Linq;
public class ReadLevel : MonoBehaviour {
	
	
public string[,] levelStatus=new string[5,5];
	
	// Use this for initialization
	void Start () {
	  print(Application.dataPath);
        string url = Application.dataPath + "/GUI/levelStatus.xml";

        XmlDocument xmldoc = new XmlDocument();


        xmldoc.Load(url);

         //读取方式
        XmlNode root = xmldoc.SelectSingleNode("LevelStatus");
		XmlNodeList nodelist = root.ChildNodes;
		foreach (XmlNode node in nodelist)
            {    
			 XmlElement xmlelement=(XmlElement)node;
              for(int i=0;i<5;i++){
			   levelStatus[i,0]=xmlelement.Attributes["levelNum"].InnerText;
			levelStatus[i,1]=xmlelement.Attributes["health"].InnerText;
			levelStatus[i,2]=xmlelement.Attributes["energy"].InnerText;
			levelStatus[i,3]=xmlelement.Attributes["damage"].InnerText;
			levelStatus[i,4]=xmlelement.Attributes["defence"].InnerText;
			}
		}
	}
	
	string GetValue(int i, int j)
	{
		return levelStatus[i, j];
	}
}
